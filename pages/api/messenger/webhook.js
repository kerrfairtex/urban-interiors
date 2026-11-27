import { db, toProduct } from '../../../lib/db'
import { isConfigured, sendProductCard, sendText, setupProfile, verifySignature } from '../../../lib/messenger'
import { decodeMessengerRef } from '../../../utils/messengerRef'
import { normalizeSelection, unitPrice } from '../../../utils/productOptions'

// Facebook signs the raw body, so Next must not parse it first.
export const config = { api: { bodyParser: false } }

const readRaw = (req) => new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
})

// Runs once per database: adds the Get Started button and greeting to the Page.
const ensureProfile = async (sql) => {
    const done = await sql`SELECT 1 FROM app_secrets WHERE name = 'messenger:profile-v1'`
    if (done.length) return
    await setupProfile()
    await sql`INSERT INTO app_secrets (name, value) VALUES ('messenger:profile-v1', 'done') ON CONFLICT (name) DO NOTHING`
}

const handleEvent = async (sql, event, siteUrl) => {
    const psid = event.sender?.id
    if (!psid) return
    const ref = event.referral?.ref || event.postback?.referral?.ref || event.message?.referral?.ref
    const decoded = ref ? decodeMessengerRef(ref) : null
    if (decoded) {
        const rows = await sql`SELECT * FROM products WHERE id = ${decoded.pid}`
        if (rows.length) {
            const product = toProduct(rows[0])
            const selection = normalizeSelection(product, decoded.selection)
            await sendProductCard(psid, product, selection, unitPrice(product, selection), siteUrl)
            return
        }
    }
    if (event.postback?.payload === 'GET_STARTED') {
        await sendText(psid, 'Hi! Thanks for messaging Ka Elton Furniture. How can we help you today?')
    }
}

export default async function handler(req, res) {
    // Meta checks the webhook URL once with this GET.
    if (req.method === 'GET') {
        const q = req.query
        const verify = process.env.MESSENGER_VERIFY_TOKEN
        if (q['hub.mode'] === 'subscribe' && verify && q['hub.verify_token'] === verify) {
            return res.status(200).send(q['hub.challenge'])
        }
        return res.status(403).end()
    }
    if (req.method !== 'POST') return res.status(405).end()

    const raw = await readRaw(req)
    if (!isConfigured() || !verifySignature(raw, req.headers['x-hub-signature-256'])) {
        return res.status(403).end()
    }
    let body
    try { body = JSON.parse(raw.toString('utf8')) } catch { return res.status(400).end() }
    if (body.object !== 'page') return res.status(404).end()

    const host = req.headers['x-forwarded-host'] || req.headers.host
    const siteUrl = `https://${host}`
    try {
        const sql = await db()
        await ensureProfile(sql).catch(e => console.error('Messenger profile setup failed:', e.message))
        for (const entry of body.entry || []) {
            for (const event of entry.messaging || []) {
                await handleEvent(sql, event, siteUrl).catch(e => console.error('Messenger reply failed:', e.message))
            }
        }
    } catch (e) {
        console.error(e)
    }
    // Always 200 so Facebook does not retry and resend the same event.
    return res.status(200).send('EVENT_RECEIVED')
}

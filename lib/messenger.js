// Server-only: Facebook Page bot that answers "Message us on Messenger" taps with a
// product card. Env vars (all set in Vercel):
//   MESSENGER_PAGE_ACCESS_TOKEN - Page access token from the Meta app
//   MESSENGER_APP_SECRET        - the Meta app's secret (verifies webhook signatures)
//   MESSENGER_VERIFY_TOKEN      - any long random text, also typed into the Meta webhook form
//   MESSENGER_GRAPH_VERSION     - optional, e.g. v23.0
import crypto from 'crypto'
import { describeSelection, peso } from '../utils/productOptions'

const graph = () => `https://graph.facebook.com/${process.env.MESSENGER_GRAPH_VERSION || 'v23.0'}`
const token = () => process.env.MESSENGER_PAGE_ACCESS_TOKEN

export const isConfigured = () => !!(token() && process.env.MESSENGER_APP_SECRET)

export const verifySignature = (rawBody, header) => {
    const secret = process.env.MESSENGER_APP_SECRET
    if (!secret || !header || !header.startsWith('sha256=')) return false
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    const given = header.slice('sha256='.length)
    return given.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(given, 'hex'), Buffer.from(expected, 'hex'))
}

const callGraph = async (path, body) => {
    const res = await fetch(`${graph()}${path}?access_token=${encodeURIComponent(token())}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(`Graph ${path} ${res.status}: ${await res.text().catch(() => '')}`)
    return res.json()
}

const send = (psid, message) =>
    callGraph('/me/messages', { recipient: { id: psid }, messaging_type: 'RESPONSE', message })

const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

export const sendProductCard = async (psid, product, selection, price, siteUrl) => {
    const url = `${siteUrl}/${product.category}/${product.pid}`
    const src = (product.images || [])[0] || ''
    const image = !src ? undefined : /^https?:\/\//.test(src) ? src : `${siteUrl}${src}`
    const options = describeSelection(selection)
    await send(psid, {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [{
                    title: clip(product.productName, 80),
                    subtitle: clip(`${peso(price)}${options ? ` · ${options}` : ''}`, 80),
                    ...(image ? { image_url: image } : {}),
                    default_action: { type: 'web_url', url },
                    buttons: [{ type: 'web_url', url, title: 'View product' }]
                }]
            }
        }
    })
    await send(psid, {
        text: `Hi! Thanks for your interest in the ${product.productName}${options ? ` (${options})` : ''} - ${peso(price)}. ` +
            'Tell us your questions here (delivery area, size, finish) and we will reply as soon as we can.'
    })
}

export const sendText = (psid, text) => send(psid, { text })

// Shows a "Get Started" button on new chats so the product ref reaches the bot.
export const setupProfile = () => callGraph('/me/messenger_profile', {
    get_started: { payload: 'GET_STARTED' },
    greeting: [{ locale: 'default', text: 'Hi {{user_first_name}}! Ask us about any Ka Elton Furniture product.' }]
})

import { db } from '../../../lib/db'
import { setSession, toProfile, verifyPassword, withErrors } from '../../../lib/auth'

export default withErrors(async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end()
    const email = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')

    const sql = await db()
    const rows = await sql`SELECT * FROM users WHERE email = ${email}`
    if (!rows.length || !(await verifyPassword(password, rows[0].password_hash)))
        return res.status(401).json({ error: 'Incorrect email or password.' })

    await setSession(res, rows[0].id)
    return res.status(200).json({ profile: toProfile(rows[0]) })
})

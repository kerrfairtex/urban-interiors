import { db } from '../../../lib/db'
import { hashPassword, setSession, toProfile, withErrors } from '../../../lib/auth'
import { SignupValidation } from '../../../utils/validate'

export default withErrors(async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end()
    const fullname = String(req.body?.fullname || '').trim()
    const email = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')

    const errors = SignupValidation(fullname, email, password)
    if (Object.keys(errors).length) return res.status(400).json({ error: Object.values(errors)[0] })

    const sql = await db()
    const existing = await sql`SELECT 1 FROM users WHERE email = ${email}`
    if (existing.length) return res.status(409).json({ error: 'An account with this email already exists.' })

    // The very first account becomes the store admin.
    const rows = await sql`
        INSERT INTO users (fullname, email, password_hash, is_admin)
        VALUES (${fullname}, ${email}, ${await hashPassword(password)},
                NOT EXISTS (SELECT 1 FROM users))
        RETURNING *`
    await setSession(res, rows[0].id)
    return res.status(201).json({ profile: toProfile(rows[0]) })
})

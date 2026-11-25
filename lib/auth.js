// Server-only: password hashing and signed session cookies (no third-party auth service).
import crypto from 'crypto'
import { promisify } from 'util'
import { db, toProfile } from './db'

const scrypt = promisify(crypto.scrypt)
const COOKIE = 'ui_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

let cachedSecret = null
const getSecret = async () => {
    if (!cachedSecret) {
        const sql = await db()
        const rows = await sql`SELECT value FROM app_secrets WHERE name = 'session'`
        cachedSecret = rows[0].value
    }
    return cachedSecret
}

export const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const key = await scrypt(password, salt, 64)
    return `${salt}:${key.toString('hex')}`
}

export const verifyPassword = async (password, stored) => {
    const [salt, hex] = stored.split(':')
    const key = await scrypt(password, salt, 64)
    const expected = Buffer.from(hex, 'hex')
    return expected.length === key.length && crypto.timingSafeEqual(expected, key)
}

const sign = (data, secret) =>
    crypto.createHmac('sha256', secret).update(data).digest('base64url')

export const setSession = async (res, uid) => {
    const payload = Buffer.from(JSON.stringify({
        uid, exp: Math.floor(Date.now() / 1000) + MAX_AGE
    })).toString('base64url')
    const token = `${payload}.${sign(payload, await getSecret())}`
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
    res.setHeader('Set-Cookie',
        `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`)
}

export const clearSession = (res) => {
    res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}

const readUid = async (req) => {
    const token = req.cookies?.[COOKIE]
    if (!token) return null
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return null
    const expected = sign(payload, await getSecret())
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
    try {
        const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
        if (!uid || exp < Math.floor(Date.now() / 1000)) return null
        return uid
    } catch {
        return null
    }
}

// Returns the raw user row for the signed-in user, or null.
export const getUser = async (req) => {
    const uid = await readUid(req)
    if (!uid) return null
    const sql = await db()
    const rows = await sql`SELECT * FROM users WHERE id = ${uid}`
    return rows[0] || null
}

// Wraps an API handler so it only runs for a signed-in user (and optionally only for admins).
export const withUser = (handler, { admin = false } = {}) => async (req, res) => {
    try {
        const user = await getUser(req)
        if (!user) return res.status(401).json({ error: 'Please log in first.' })
        if (admin && !user.is_admin) return res.status(403).json({ error: 'Admins only.' })
        return await handler(req, res, user)
    } catch (e) {
        console.error(e)
        return res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
}

export const withErrors = (handler) => async (req, res) => {
    try {
        return await handler(req, res)
    } catch (e) {
        console.error(e)
        return res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
}

export { toProfile }

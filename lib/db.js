// Server-only: Neon Postgres access. DATABASE_URL is injected by the Neon
// integration from the Vercel Marketplace, so there is nothing to configure by hand.
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'
import { runSeeds } from './seed'

export const isUuid = (v) =>
    typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)

let sqlClient = null
let schemaReady = null

export const getSql = () => {
    if (!sqlClient) {
        const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
        if (!url) throw new Error('DATABASE_URL is not set. Connect a Neon database to this Vercel project.')
        sqlClient = neon(url)
    }
    return sqlClient
}

// Tables are created on first use, so a fresh database works without a migration step.
export const ensureSchema = () => {
    if (!schemaReady) {
        const sql = getSql()
        schemaReady = (async () => {
            await sql`CREATE TABLE IF NOT EXISTS app_secrets (
                name TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )`
            await sql`CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                fullname TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                is_admin BOOLEAN NOT NULL DEFAULT FALSE,
                cart JSONB NOT NULL DEFAULT '{"totalItems":0,"totalPrice":0,"items":{}}'::jsonb,
                wishlist JSONB NOT NULL DEFAULT '[]'::jsonb,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )`
            await sql`CREATE TABLE IF NOT EXISTS products (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                product_name TEXT NOT NULL,
                product_price NUMERIC NOT NULL,
                category TEXT NOT NULL,
                subcategory TEXT[] NOT NULL DEFAULT '{}',
                color TEXT[] NOT NULL DEFAULT '{}',
                color_value TEXT[] NOT NULL DEFAULT '{}',
                width NUMERIC,
                length NUMERIC,
                height NUMERIC,
                images TEXT[] NOT NULL DEFAULT '{}',
                description TEXT NOT NULL DEFAULT '',
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )`
            await sql`CREATE INDEX IF NOT EXISTS products_category_idx ON products (category, created_at)`
            // Photos per view, 3D model, wood, sizes, variants, stains and finishes (see utils/productOptions.js).
            await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb`
            await sql`CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                status TEXT NOT NULL DEFAULT 'Pending',
                total_price NUMERIC NOT NULL,
                fullname TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                state TEXT NOT NULL,
                city TEXT NOT NULL,
                address TEXT NOT NULL,
                items JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )`
            await sql`CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at)`
            await sql`CREATE TABLE IF NOT EXISTS inquiries (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                product_id UUID REFERENCES products(id) ON DELETE SET NULL,
                product_name TEXT NOT NULL,
                selection JSONB NOT NULL DEFAULT '{}'::jsonb,
                quoted_price NUMERIC,
                name TEXT NOT NULL,
                phone TEXT NOT NULL DEFAULT '',
                email TEXT NOT NULL DEFAULT '',
                message TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'New',
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )`
            // The session-signing secret lives in the database, so no AUTH_SECRET env var is needed.
            await sql`INSERT INTO app_secrets (name, value)
                VALUES ('session', ${crypto.randomBytes(32).toString('hex')})
                ON CONFLICT (name) DO NOTHING`
            await runSeeds(sql)
        })().catch((e) => {
            schemaReady = null
            throw e
        })
    }
    return schemaReady
}

export const db = async () => {
    await ensureSchema()
    return getSql()
}

export const toProduct = (row) => ({
    pid: row.id,
    productName: row.product_name,
    productPrice: Number(row.product_price),
    category: row.category,
    subcategory: row.subcategory,
    color: row.color,
    colorValue: row.color_value,
    width: row.width === null ? null : Number(row.width),
    length: row.length === null ? null : Number(row.length),
    height: row.height === null ? null : Number(row.height),
    images: row.images,
    desc: row.description,
    details: row.details || {},
    createdAt: row.created_at
})

export const toInquiry = (row) => ({
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    selection: row.selection,
    quotedPrice: row.quoted_price === null ? null : Number(row.quoted_price),
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    status: row.status,
    createdAt: row.created_at
})

export const toOrder = (row) => ({
    pid: row.id,
    orderId: row.id,
    uid: row.user_id,
    status: row.status,
    date: row.created_at,
    totalPrice: Number(row.total_price),
    fullname: row.fullname,
    email: row.email,
    phone: row.phone,
    state: row.state,
    city: row.city,
    address: row.address,
    items: row.items
})

export const toProfile = (row) => ({
    uid: row.id,
    fullname: row.fullname,
    displayName: row.fullname,
    email: row.email,
    isAdmin: row.is_admin,
    cart: row.cart,
    wishlist: row.wishlist
})

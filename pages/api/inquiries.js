import { db, isUuid, toProduct } from '../../lib/db'
import { withErrors } from '../../lib/auth'
import { normalizeSelection, unitPrice } from '../../utils/productOptions'

// Public: anyone can ask about a product (no account needed). The quoted price is
// recalculated here from the chosen options.
export default withErrors(async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end()
    const b = req.body || {}
    const text = (v, max) => String(v ?? '').trim().slice(0, max)
    const name = text(b.name, 100)
    const phone = text(b.phone, 40)
    const email = text(b.email, 200)
    const message = text(b.message, 2000)

    if (name.length < 2) return res.status(400).json({ error: 'Please enter your name' })
    if (!phone && !email) return res.status(400).json({ error: 'Please enter a phone number or email so we can reply' })
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email' })
    if (phone && !/^[0-9+()\-\s]{7,20}$/.test(phone)) return res.status(400).json({ error: 'Please enter a valid phone number' })
    if (!isUuid(b.productId)) return res.status(400).json({ error: 'Invalid product' })

    const sql = await db()
    const rows = await sql`SELECT * FROM products WHERE id = ${b.productId}`
    if (!rows.length) return res.status(404).json({ error: 'Product not found' })
    const product = toProduct(rows[0])
    const selection = normalizeSelection(product, b.selection)
    const price = unitPrice(product, selection)

    await sql`
        INSERT INTO inquiries (product_id, product_name, selection, quoted_price, name, phone, email, message)
        VALUES (${product.pid}, ${product.productName}, ${JSON.stringify(selection)}::jsonb, ${price},
                ${name}, ${phone}, ${email}, ${message})`
    return res.status(201).json({ ok: true })
})

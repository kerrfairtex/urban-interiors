import { db, toProduct } from '../../../lib/db'
import { withUser } from '../../../lib/auth'
import { AddProductValidation } from '../../../utils/validate'
import { sanitizeDetails } from '../../../utils/productOptions'

const isBlobImage = (u) => /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u)

const strings = (v) => (Array.isArray(v) ? v : []).map(String)

export default withUser(async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end()
    const p = req.body || {}
    const product = {
        productName: String(p.productName || '').trim(),
        productPrice: Number(p.productPrice),
        category: String(p.category || ''),
        subcategory: strings(p.subcategory),
        color: strings(p.color),
        colorValue: strings(p.colorValue),
        width: Number(p.width),
        length: Number(p.length),
        height: Number(p.height),
        // Only accept images that were uploaded to this project's Vercel Blob store.
        images: strings(p.images).filter(isBlobImage),
        details: sanitizeDetails(p.details, isBlobImage),
        desc: String(p.desc || '').trim()
    }

    const errors = AddProductValidation(product.productName, product.productPrice, product.category,
        product.subcategory, product.color, product.width, product.length, product.height,
        product.images, product.desc)
    if (!product.images.length) errors.image = 'Please choose at least one image'
    if (Object.keys(errors).length) return res.status(400).json({ error: Object.values(errors)[0] })

    const sql = await db()
    const rows = await sql`
        INSERT INTO products (product_name, product_price, category, subcategory, color, color_value,
                              width, length, height, images, description, details)
        VALUES (${product.productName}, ${product.productPrice}, ${product.category},
                ${product.subcategory}, ${product.color}, ${product.colorValue},
                ${product.width}, ${product.length}, ${product.height},
                ${product.images}, ${product.desc}, ${JSON.stringify(product.details)}::jsonb)
        RETURNING *`
    return res.status(201).json({ product: toProduct(rows[0]) })
}, { admin: true })

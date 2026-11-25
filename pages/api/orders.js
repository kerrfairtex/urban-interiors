import { db, toOrder } from '../../lib/db'
import { withUser } from '../../lib/auth'
import { priceCart } from '../../lib/cart'
import { CheckoutValidation } from '../../utils/validate'

import { SHIPPING_FEE } from '../../utils/constants'

export default withUser(async (req, res, user) => {
    const sql = await db()

    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM orders WHERE user_id = ${user.id} ORDER BY created_at DESC`
        return res.status(200).json({ orders: rows.map(toOrder) })
    }

    if (req.method === 'POST') {
        const info = req.body || {}
        const fullname = String(info.fullname || '').trim()
        const phone = String(info.phone || '').trim()
        const state = String(info.state || '').trim()
        const city = String(info.city || '').trim()
        const address = String(info.address || '').trim()
        const errors = CheckoutValidation(fullname, phone, state, city, address)
        if (Object.keys(errors).length) return res.status(400).json({ error: Object.values(errors)[0] })

        const cart = await priceCart(sql, user.cart?.items)
        const ids = Object.keys(cart.items)
        if (!ids.length) return res.status(400).json({ error: 'Your cart is empty.' })

        const products = await sql`SELECT * FROM products WHERE id = ANY(${ids}::uuid[])`
        const items = products.map(p => ({
            pid: p.id,
            title: p.product_name,
            category: p.category,
            price: Number(p.product_price),
            img: p.images[0] || null,
            quantity: cart.items[p.id].quantity,
            color: cart.items[p.id].color
        }))

        const emptyCart = { totalItems: 0, totalPrice: 0, items: {} }
        const [orderRows] = await sql.transaction([
            sql`INSERT INTO orders (user_id, total_price, fullname, email, phone, state, city, address, items)
                VALUES (${user.id}, ${cart.totalPrice + SHIPPING_FEE}, ${fullname}, ${user.email},
                        ${phone}, ${state}, ${city}, ${address}, ${JSON.stringify(items)}::jsonb)
                RETURNING *`,
            sql`UPDATE users SET cart = ${JSON.stringify(emptyCart)}::jsonb WHERE id = ${user.id}`
        ])
        return res.status(201).json({ order: toOrder(orderRows[0]), cart: emptyCart })
    }

    return res.status(405).end()
})

import { db } from '../../lib/db'
import { withUser } from '../../lib/auth'
import { priceCart } from '../../lib/cart'
import { isUuid } from '../../lib/db'

export default withUser(async (req, res, user) => {
    if (req.method !== 'POST') return res.status(405).end()
    const { action, productId, options } = req.body || {}
    if (action !== 'clear' && !isUuid(productId)) return res.status(400).json({ error: 'Invalid product' })
    const items = { ...(user.cart?.items || {}) }

    switch (action) {
        case 'add': {
            // Adding a product that is already in the cart switches it to the new selection.
            const picked = {}
            for (const [k, v] of Object.entries(options && typeof options === 'object' ? options : {}))
                picked[String(k).slice(0, 20)] = String(v).slice(0, 80)
            items[productId] = { quantity: items[productId]?.quantity || 1, options: picked }
            break
        }
        case 'increase':
            if (items[productId]) items[productId] = { ...items[productId], quantity: items[productId].quantity + 1 }
            break
        case 'decrease':
            if (items[productId] && items[productId].quantity > 1)
                items[productId] = { ...items[productId], quantity: items[productId].quantity - 1 }
            break
        case 'remove':
            delete items[productId]
            break
        case 'clear':
            for (const id of Object.keys(items)) delete items[id]
            break
        default:
            return res.status(400).json({ error: 'Unknown cart action' })
    }

    const sql = await db()
    const cart = await priceCart(sql, items)
    await sql`UPDATE users SET cart = ${JSON.stringify(cart)}::jsonb WHERE id = ${user.id}`
    return res.status(200).json({ cart })
})

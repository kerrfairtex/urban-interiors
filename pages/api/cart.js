import { db } from '../../lib/db'
import { withUser } from '../../lib/auth'
import { priceCart } from '../../lib/cart'
import { isUuid } from '../../lib/db'

export default withUser(async (req, res, user) => {
    if (req.method !== 'POST') return res.status(405).end()
    const { action, productId, color } = req.body || {}
    if (action !== 'clear' && !isUuid(productId)) return res.status(400).json({ error: 'Invalid product' })
    const items = { ...(user.cart?.items || {}) }

    switch (action) {
        case 'add':
            if (items[productId]) return res.status(409).json({ error: 'Item already exists in Cart' })
            items[productId] = {
                quantity: 1,
                color: { name: String(color?.name || ''), value: String(color?.value || '') }
            }
            break
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

import { db } from '../../lib/db'
import { withUser } from '../../lib/auth'
import { isUuid } from '../../lib/db'

export default withUser(async (req, res, user) => {
    if (req.method !== 'POST') return res.status(405).end()
    const { action, productId } = req.body || {}
    if (!isUuid(productId)) return res.status(400).json({ error: 'Invalid product' })
    let wishlist = Array.isArray(user.wishlist) ? [...user.wishlist] : []

    if (action === 'add') {
        if (wishlist.includes(productId)) return res.status(409).json({ error: 'Item already exists in wishlist' })
        wishlist.push(String(productId))
    } else if (action === 'remove') {
        wishlist = wishlist.filter(id => id !== productId)
    } else {
        return res.status(400).json({ error: 'Unknown wishlist action' })
    }

    const sql = await db()
    await sql`UPDATE users SET wishlist = ${JSON.stringify(wishlist)}::jsonb WHERE id = ${user.id}`
    return res.status(200).json({ wishlist })
})

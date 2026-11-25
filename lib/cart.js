// Server-only cart pricing.
import { isUuid } from './db'

// Totals are always recomputed from current product prices, never trusted from the client.
export const priceCart = async (sql, items) => {
    const ids = Object.keys(items || {}).filter(isUuid)
    if (!ids.length) return { totalItems: 0, totalPrice: 0, items: {} }
    const rows = await sql`SELECT id, product_price FROM products WHERE id = ANY(${ids}::uuid[])`
    const prices = Object.fromEntries(rows.map(r => [r.id, Number(r.product_price)]))
    const cleaned = {}
    let totalItems = 0
    let totalPrice = 0
    for (const id of ids) {
        if (prices[id] === undefined) continue
        const quantity = Math.max(1, Math.floor(Number(items[id].quantity) || 1))
        cleaned[id] = { quantity, color: items[id].color }
        totalItems += quantity
        totalPrice += quantity * prices[id]
    }
    return { totalItems, totalPrice, items: cleaned }
}


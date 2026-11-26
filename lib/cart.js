// Server-only cart pricing.
import { isUuid, toProduct } from './db'
import { chosen, normalizeSelection, unitPrice } from '../utils/productOptions'

// Totals are always recomputed from current product prices and options, never trusted from the client.
export const priceCart = async (sql, items) => {
    const ids = Object.keys(items || {}).filter(isUuid)
    if (!ids.length) return { totalItems: 0, totalPrice: 0, items: {} }
    const rows = await sql`SELECT * FROM products WHERE id = ANY(${ids}::uuid[])`
    const products = Object.fromEntries(rows.map(r => [r.id, toProduct(r)]))
    const cleaned = {}
    let totalItems = 0
    let totalPrice = 0
    for (const id of ids) {
        const product = products[id]
        if (!product) continue
        const item = items[id] || {}
        // Older cart entries only stored a color.
        const options = normalizeSelection(product, item.options || { color: item.color?.name })
        const price = unitPrice(product, options)
        const color = chosen(product, options, 'color')
        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1))
        cleaned[id] = {
            quantity,
            options,
            unitPrice: price,
            color: color ? { name: color.name, value: color.swatch || '' } : { name: '', value: '' }
        }
        totalItems += quantity
        totalPrice += quantity * price
    }
    return { totalItems, totalPrice, items: cleaned }
}

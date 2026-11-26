// Shared by the browser and the server: product option groups and price calculation.
// The server always recalculates prices with these same functions, so the price a
// shopper sees for a configuration is exactly what the cart and orders charge.

// Option groups in display order. "color" comes from the product's color list.
export const OPTION_GROUPS = [
    { key: 'size', label: 'Size' },
    { key: 'variant', label: 'Design variant' },
    { key: 'stain', label: 'Wood stain' },
    { key: 'finish', label: 'Finish' },
    { key: 'color', label: 'Color' }
]

export const VIEW_SLOTS = [
    { key: 'front', label: 'Front' },
    { key: 'back', label: 'Back' },
    { key: 'side', label: 'Side' },
    { key: 'top', label: 'Top' },
    { key: 'detail', label: 'Detail' }
]

export const MODEL_TYPES = [
    { key: '', label: 'No 3D model' },
    { key: 'dining-rect', label: 'Rectangular dining set' },
    { key: 'dining-round', label: 'Round dining set (pedestal)' },
    { key: 'dining-round-upholstered', label: 'Round dining set (4 legs, upholstered chairs)' },
    { key: 'live-edge', label: 'Live-edge table set' }
]

const FT_TO_CM = 30.48

const num = (v, fallback = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
}

// The option groups that actually have choices for this product.
export const getGroups = (product) => {
    const details = product?.details || {}
    const groups = []
    for (const { key, label } of OPTION_GROUPS) {
        let choices
        if (key === 'color') {
            choices = (product?.color || []).map((name, i) => ({
                name, swatch: product.colorValue?.[i] || null, price: 0
            }))
        } else {
            choices = (details[key] || []).filter(c => c && c.name)
        }
        if (choices.length) groups.push({ key, label, choices })
    }
    return groups
}

// The standard choice of a group: the first one that adds nothing to the price.
const standardChoice = (group) => group.choices.find(c => !Number(c.price)) || group.choices[0]

// Keeps only valid choices; anything missing or unknown falls back to the standard choice.
export const normalizeSelection = (product, selection = {}) => {
    const result = {}
    for (const group of getGroups(product)) {
        const wanted = selection?.[group.key]
        const found = group.choices.find(c => c.name === wanted)
        result[group.key] = (found || standardChoice(group)).name
    }
    return result
}

export const chosen = (product, selection, key) => {
    const group = getGroups(product).find(g => g.key === key)
    if (!group) return null
    return group.choices.find(c => c.name === selection?.[key]) || standardChoice(group)
}

export const unitPrice = (product, selection) => {
    const sel = normalizeSelection(product, selection)
    let price = num(product.productPrice)
    for (const group of getGroups(product)) {
        const choice = group.choices.find(c => c.name === sel[group.key])
        price += num(choice?.price)
    }
    return Math.max(0, Math.round(price))
}

// Lowest possible price, for "From ₱..." labels.
export const startingPrice = (product) => {
    let price = num(product.productPrice)
    for (const group of getGroups(product))
        price += Math.min(...group.choices.map(c => num(c.price)))
    return Math.max(0, Math.round(price))
}

// Dimensions in cm and weight in kg for the chosen size (older products store feet).
export const getDimensions = (product, selection) => {
    const size = chosen(product, selection, 'size')
    if (size && size.width) {
        return {
            width: num(size.width), depth: num(size.depth), height: num(size.height),
            weight: size.weight ? num(size.weight) : null
        }
    }
    return {
        width: Math.round(num(product.width) * FT_TO_CM),
        depth: Math.round(num(product.length) * FT_TO_CM),
        height: Math.round(num(product.height) * FT_TO_CM),
        weight: product.details?.weight ? num(product.details.weight) : null
    }
}

export const describeSelection = (selection) =>
    OPTION_GROUPS
        .filter(g => selection?.[g.key])
        .map(g => `${g.label}: ${selection[g.key]}`)
        .join(' · ')

// "₱68,000" or "From ₱30,000" when options change the price.
export const priceLabel = (product) => {
    const from = startingPrice(product)
    const varies = getGroups(product).some(g => g.choices.some(c => Number(c.price) !== 0))
    return varies ? `From ${peso(from)}` : peso(from)
}

export const peso = (n) => `₱${new Intl.NumberFormat('en-PH').format(n || 0)}`

// Server-side cleanup of admin-entered details, so only expected fields are stored.
export const sanitizeDetails = (raw, isAllowedImage) => {
    const d = raw && typeof raw === 'object' ? raw : {}
    const text = (v, max = 200) => String(v ?? '').trim().slice(0, max)
    const choiceList = (list, extra = []) => (Array.isArray(list) ? list : [])
        .slice(0, 12)
        .map(c => {
            const out = { name: text(c?.name, 80), price: Math.round(num(c?.price)) }
            if (c?.swatch && /^#[0-9a-f]{6}$/i.test(c.swatch)) out.swatch = c.swatch
            if (c?.note) out.note = text(c.note, 160)
            for (const k of extra) if (c?.[k] !== undefined && c[k] !== '') out[k] = num(c[k])
            return out
        })
        .filter(c => c.name)

    const views = {}
    for (const { key } of VIEW_SLOTS) {
        const url = d.views?.[key]
        if (typeof url === 'string' && isAllowedImage(url)) views[key] = url
    }
    return {
        views,
        weight: num(d.weight) > 0 ? num(d.weight) : undefined,
        model: MODEL_TYPES.some(m => m.key === d.model) ? d.model : '',
        wood: {
            species: text(d.wood?.species, 80),
            construction: (Array.isArray(d.wood?.construction) ? d.wood.construction : [])
                .map(c => text(c, 160)).filter(Boolean).slice(0, 12)
        },
        size: choiceList(d.size, ['width', 'depth', 'height', 'weight', 'seats']),
        variant: choiceList(d.variant, ['seats', 'bench']),
        stain: choiceList(d.stain),
        finish: choiceList(d.finish)
    }
}

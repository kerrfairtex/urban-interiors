// Small fetch wrapper for this app's own API routes.
export const api = async (path, { method = 'GET', body } = {}) => {
    const res = await fetch(path, {
        method,
        credentials: 'same-origin',
        headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
        const err = new Error(data.error || `Request failed (${res.status})`)
        err.status = res.status
        throw err
    }
    return data
}

export const fetchProductsByIds = async (ids) => {
    if (!ids || ids.length === 0) return []
    const { products } = await api(`/api/products?ids=${encodeURIComponent(ids.join(','))}`)
    return products
}

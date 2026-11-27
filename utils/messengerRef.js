// Packs "which product and which options" into the m.me ?ref= value, so the Page bot
// can send the right product card. Facebook allows letters, digits, - _ = and 250 chars.
const MAX_REF = 250

const toBase64Url = (text) => {
    const b64 = typeof window === 'undefined'
        ? Buffer.from(text, 'utf8').toString('base64')
        : window.btoa(unescape(encodeURIComponent(text)))
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export const encodeMessengerRef = (pid, selection) => {
    const id = String(pid).replace(/-/g, '')
    const picked = Object.fromEntries(Object.entries(selection || {}).filter(([, v]) => v))
    if (!Object.keys(picked).length) return id
    const ref = `${id}_${toBase64Url(JSON.stringify(picked))}`
    return ref.length <= MAX_REF ? ref : id
}

// Server side: back to { pid, selection }; null if the ref is not ours.
export const decodeMessengerRef = (ref) => {
    const m = /^([0-9a-f]{32})(?:_([A-Za-z0-9_-]+))?$/.exec(String(ref || ''))
    if (!m) return null
    const h = m[1]
    const pid = `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
    let selection = {}
    if (m[2]) {
        try { selection = JSON.parse(Buffer.from(m[2], 'base64url').toString('utf8')) } catch { selection = {} }
    }
    return { pid, selection: selection && typeof selection === 'object' ? selection : {} }
}

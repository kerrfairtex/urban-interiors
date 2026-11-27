// Server-only: email the shop owner when a customer sends an inquiry.
// Uses Resend (https://resend.com) over plain fetch. Needs two env vars:
//   RESEND_API_KEY        - API key from resend.com
//   INQUIRY_NOTIFY_EMAIL  - where alerts go (comma-separated for several)
// Optional: INQUIRY_FROM_EMAIL - sender; defaults to Resend's test sender, which
// can only deliver to the email address the Resend account was created with.
// If the vars are missing, nothing is sent and inquiries still save normally.
import { describeSelection, getDimensions, peso } from '../utils/productOptions'

const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

export const notifyInquiry = async ({ product, selection, price, name, phone, email, message, siteUrl }) => {
    const key = process.env.RESEND_API_KEY
    const to = (process.env.INQUIRY_NOTIFY_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean)
    if (!key || !to.length) return

    const options = describeSelection(selection)
    const productUrl = siteUrl ? `${siteUrl}/${product.category}/${product.pid}` : ''
    const absolute = (src) => (!src ? '' : /^https?:\/\//.test(src) ? src : siteUrl ? `${siteUrl}${src}` : '')
    const image = absolute((product.images || [])[0])
    const dims = getDimensions(product, selection)
    const dimText = dims.width ? `${dims.width} × ${dims.depth} × ${dims.height} cm (W × D × H)` : ''
    const wood = product.details?.wood || {}
    const colors = (product.color || []).join(', ')

    const rows = [
        ['Product', product.productName],
        ['Options', options],
        ['Quoted price', peso(price)],
        ['Size', dimText],
        ['Weight', dims.weight ? `${dims.weight} kg` : ''],
        ['Wood', wood.species || ''],
        ['Colors', colors]
    ].filter(([, v]) => v)
    const customer = [
        ['Name', name],
        ['Phone', phone || '-'],
        ['Email', email || '-']
    ]
    const table = (list) => `<table cellpadding="6" style="border-collapse:collapse;font-size:14px">
            ${list.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top;white-space:nowrap">${k}</td><td><b>${escape(v)}</b></td></tr>`).join('')}
        </table>`

    const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;color:#222">
        <h2 style="margin:0 0 4px">New inquiry from ${escape(name)}</h2>
        <p style="margin:0 0 16px;color:#666">${escape(product.productName)}</p>

        <h3 style="margin:16px 0 6px">Customer</h3>
        ${table(customer)}
        ${message ? `<p style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:10px">${escape(message)}</p>` : ''}
        ${phone ? `<p><a href="tel:${escape(phone)}">Call ${escape(phone)}</a></p>` : ''}

        <h3 style="margin:20px 0 6px">Product</h3>
        ${image ? `<a href="${escape(productUrl)}"><img src="${escape(image)}" alt="${escape(product.productName)}" width="560" style="max-width:100%;height:auto;border-radius:8px;display:block"></a>` : ''}
        ${table(rows)}
        ${product.desc ? `<p style="font-size:14px;line-height:1.5">${escape(product.desc)}</p>` : ''}
        ${wood.construction?.length ? `<ul style="font-size:14px;padding-left:18px">${wood.construction.map(c => `<li>${escape(c)}</li>`).join('')}</ul>` : ''}
        ${productUrl ? `<p><a href="${escape(productUrl)}">View product on the website</a> · <a href="${escape(siteUrl)}/admin">Open admin inquiries</a></p>` : ''}
        </div>`
    const text = [
        `New inquiry from ${name}`,
        ...customer.map(([k, v]) => `${k}: ${v}`),
        message ? `\n${message}` : '',
        '',
        ...rows.map(([k, v]) => `${k}: ${v}`),
        product.desc ? `\n${product.desc}` : '',
        productUrl ? `\n${productUrl}` : ''
    ].join('\n')

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from: process.env.INQUIRY_FROM_EMAIL || 'Ka Elton Website <onboarding@resend.dev>',
            to,
            subject: `New inquiry: ${product.productName} - ${name}`,
            html,
            text,
            ...(email ? { reply_to: email } : {})
        })
    })
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => '')}`)
}

// Server-only: email the shop owner when a customer sends an inquiry.
// Uses Resend (https://resend.com) over plain fetch. Needs two env vars:
//   RESEND_API_KEY        - API key from resend.com
//   INQUIRY_NOTIFY_EMAIL  - where alerts go (comma-separated for several)
// Optional: INQUIRY_FROM_EMAIL - sender; defaults to Resend's test sender, which
// can only deliver to the email address the Resend account was created with.
// If the vars are missing, nothing is sent and inquiries still save normally.
import { describeSelection, peso } from '../utils/productOptions'

const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

export const notifyInquiry = async ({ product, selection, price, name, phone, email, message, siteUrl }) => {
    const key = process.env.RESEND_API_KEY
    const to = (process.env.INQUIRY_NOTIFY_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean)
    if (!key || !to.length) return

    const options = describeSelection(selection)
    const productUrl = siteUrl ? `${siteUrl}/${product.category}/${product.pid}` : ''
    const rows = [
        ['Product', product.productName],
        ['Options', options],
        ['Quoted price', peso(price)],
        ['Name', name],
        ['Phone', phone || '-'],
        ['Email', email || '-']
    ]
    const html = `
        <h2 style="margin:0 0 12px">New inquiry from ${escape(name)}</h2>
        <table cellpadding="6" style="border-collapse:collapse">
            ${rows.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${escape(v)}</b></td></tr>`).join('')}
        </table>
        ${message ? `<p style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:10px">${escape(message)}</p>` : ''}
        ${phone ? `<p><a href="tel:${escape(phone)}">Call ${escape(phone)}</a></p>` : ''}
        ${productUrl ? `<p><a href="${escape(productUrl)}">View product</a> · <a href="${escape(siteUrl)}/admin">Open admin inquiries</a></p>` : ''}`
    const text = [
        `New inquiry from ${name}`,
        ...rows.map(([k, v]) => `${k}: ${v}`),
        message ? `\n${message}` : '',
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

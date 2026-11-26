// Issues short-lived Vercel Blob upload tokens to admins; the browser uploads
// product images straight to Blob, which avoids the serverless request-size limit.
import { handleUpload } from '@vercel/blob/client'
import { getUser, withErrors } from '../../../lib/auth'

export default withErrors(async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end()
    try {
        const result = await handleUpload({
            body: req.body,
            request: req,
            onBeforeGenerateToken: async () => {
                const user = await getUser(req)
                if (!user?.is_admin) throw new Error('Admins only.')
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
                    maximumSizeInBytes: 15 * 1024 * 1024,
                    addRandomSuffix: true
                }
            },
            onUploadCompleted: async () => {}
        })
        return res.status(200).json(result)
    } catch (e) {
        return res.status(400).json({ error: e.message })
    }
})

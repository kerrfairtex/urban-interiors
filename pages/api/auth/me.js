import { getUser, toProfile, withErrors } from '../../../lib/auth'

export default withErrors(async (req, res) => {
    const user = await getUser(req)
    return res.status(200).json({ profile: user ? toProfile(user) : null })
})

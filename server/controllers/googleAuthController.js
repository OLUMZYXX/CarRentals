import { OAuth2Client } from 'google-auth-library'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { email, name, sub } = payload

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name,
        email,
        password: sub, // Not used for Google users, but required by schema
        role: 'user',
      })
    }
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.json({ success: true, token: jwtToken, user })
  } catch (error) {
    console.error('Google login error:', error)
    res.status(500).json({ success: false, message: 'Google login failed' })
  }
}

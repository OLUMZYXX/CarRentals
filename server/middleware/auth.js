import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch the full user from DB to get _id and other fields
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user

    next()
  } catch (error) {
    console.error('JWT verification error:', error.message)
    res.status(401).json({ message: 'Token is not valid or expired' })
  }
}

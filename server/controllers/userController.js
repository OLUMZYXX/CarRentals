import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Car from '../models/Car.js'

// Generate JWT_SECRET Token
const generateToken = (userId, role) => {
  const payload = { id: userId, role }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// registerUser
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required and password must be at least 8 characters',
      })
    }
    if (role !== 'user' && role !== 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      })
    }
    const userExist = await User.findOne({ email })
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })
    const token = generateToken(user._id.toString(), user.role)
    res
      .status(201)
      .json({ success: true, token, message: 'Account created successfully' })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Login user
// In userController.js
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid password' })
    }
    const token = generateToken(user._id.toString(), user.role)
    res.status(200).json({
      success: true,
      token,
      message: 'Logged in successfully',
      user,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

// get User data using Token (JWT) - FIXED VERSION
export const getUserData = async (req, res) => {
  try {
    // req.user likely only contains the user ID from your auth middleware
    // We need to fetch the full user data from the database
    const userId = req.user.id || req.user._id || req.user

    // Fetch full user data from database, excluding password
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error('Error getting user data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Get All cars for the front end
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true })
    res.status(200).json({ success: true, cars })
  } catch (error) {
    console.error('Error getting all cars:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

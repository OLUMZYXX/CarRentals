import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Car from '../models/Car.js'
import { sendEmail } from '../utils/sendEmail.js'

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
    // Send welcome email
    const welcomeEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome!</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; text-align: center; color: #333; }
          .welcome-text { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-item { margin: 10px 0; font-size: 16px; }
          .footer { padding: 30px; text-align: center; color: #666; font-size: 14px; }
          .support-link { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Welcome to Our Car Rental Service!</h1>
          </div>
          <div class="content">
            <p class="welcome-text">Dear <strong>${name}</strong>,</p>
            <p>Your car rental account has been created successfully! We're excited to help you find the perfect vehicle for your journey.</p>
            
            <div class="details">
              <div class="detail-item"><strong>Account Created:</strong> ${new Date().toLocaleString(
                'en-US',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}</div>
              <div class="detail-item"><strong>Email:</strong> ${email}</div>
              <div class="detail-item"><strong>Role:</strong> ${
                role.charAt(0).toUpperCase() + role.slice(1)
              }</div>
            </div>

            <p>You can now start browsing our fleet of vehicles and make reservations. Whether you need a car for business, vacation, or daily commute, we have the perfect vehicle for you!</p>
          </div>
          <div class="footer">
            <p>If you experience any problems, kindly contact us at <a href="mailto:support@carrentals.com" class="support-link">support@carrentals.com</a></p>
            <p><strong>Best regards,<br>Car Rentals Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `

    await sendEmail(user.email, '🚗 Welcome to Car Rentals!', welcomeEmailHtml)
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
    // Send login notification email
    const loginEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Back!</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; text-align: center; color: #333; }
          .welcome-text { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-item { margin: 10px 0; font-size: 16px; }
          .footer { padding: 30px; text-align: center; color: #666; font-size: 14px; }
          .support-link { color: #28a745; text-decoration: none; }
          .security-notice { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Welcome Back!</h1>
          </div>
          <div class="content">
            <p class="welcome-text">Hello <strong>${user.name}</strong>,</p>
            <p>You have successfully logged into your car rental account. Ready to hit the road?</p>
            
            <div class="details">
              <div class="detail-item"><strong>Login Time:</strong> ${new Date().toLocaleString(
                'en-US',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}</div>
              <div class="detail-item"><strong>Email:</strong> ${
                user.email
              }</div>
              <div class="detail-item"><strong>Account Type:</strong> ${
                user.role.charAt(0).toUpperCase() + user.role.slice(1)
              }</div>
            </div>

            <div class="security-notice">
              <strong>Security Notice:</strong> If this wasn't you, please contact our support team immediately.
            </div>

            <p>Browse our available vehicles, manage your bookings, and get ready for your next adventure!</p>
          </div>
          <div class="footer">
            <p>If you experience any problems, kindly contact us at <a href="mailto:support@carrentals.com" class="support-link">support@carrentals.com</a></p>
            <p><strong>Kind regards,<br>Car Rentals Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `

    await sendEmail(user.email, '👋 Welcome Back!', loginEmailHtml)
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

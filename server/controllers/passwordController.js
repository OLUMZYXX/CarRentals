import User from '../models/user.js'
import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail.js'

const resetTokens = new Map()

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found' })

  const min = 10000
  const max = 9999999
  const code = Math.floor(Math.random() * (max - min + 1)) + min
  // Store code, userId, and expiry (15 minutes from now)
  const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes in ms
  resetTokens.set(code.toString(), { userId: user._id.toString(), expiresAt })

  const resetEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Code</title>
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 30px; text-align: center; color: #333; }
        .welcome-text { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
        .code-container { background-color: #f8f9fa; border: 2px dashed #667eea; padding: 30px; border-radius: 12px; margin: 30px 0; }
        .reset-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 3px; margin: 10px 0; }
        .details { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; color: #856404; }
        .footer { padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .support-link { color: #ff6b6b; text-decoration: none; }
        .security-note { font-size: 14px; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p class="welcome-text">Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your Car Rentals account password. Use the code below to reset your password:</p>
          
          <div class="code-container">
            <p style="margin: 0; font-size: 16px; color: #666;">Your Reset Code</p>
            <div class="reset-code">${code}</div>
            <p style="margin: 0; font-size: 14px; color: #888;">Enter this code in the password reset form to continue</p>
            <p style="margin: 0; font-size: 14px; color: #d9534f; font-weight: bold;">This code expires in 15 minutes.</p>
          </div>

          <div class="details">
            <div style="margin: 10px 0; font-size: 16px;"><strong>Request Time:</strong> ${new Date().toLocaleString(
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
            <div style="margin: 10px 0; font-size: 16px;"><strong>Account:</strong> ${email}</div>
          </div>

          <p>If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
          
          <div class="security-note">
            <strong>Security Notice:</strong> This code will expire in 15 minutes for your security.
          </div>
        </div>
        <div class="footer">
          <p>If you experience any problems, kindly contact us at <a href="mailto:support@carrentals.com" class="support-link">support@carrentals.com</a></p>
          <p><strong>Best regards,<br>Car Rentals Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail(email, '🔐 Car Rentals - Password Reset Code', resetEmailHtml)
  res.json({ success: true, message: 'Reset code sent to email' })
}

export const resetPassword = async (req, res) => {
  const { code, newPassword, confirmPassword } = req.body
  if (newPassword !== confirmPassword)
    return res
      .status(400)
      .json({ success: false, message: 'Passwords do not match' })

  const tokenData = resetTokens.get(code)
  if (!tokenData || Date.now() > tokenData.expiresAt) {
    resetTokens.delete(code)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid or expired code' })
  }

  const user = await User.findById(tokenData.userId)
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found' })

  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.default.hash(newPassword, 10)
  user.password = hashedPassword
  await user.save()
  resetTokens.delete(code)

  const successEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 30px; text-align: center; color: #333; }
        .welcome-text { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
        .success-icon { font-size: 48px; margin: 20px 0; }
        .details { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; color: #155724; }
        .footer { padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .support-link { color: #28a745; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Password Reset Successful</h1>
        </div>
        <div class="content">
          <div class="success-icon">🎉</div>
          <p class="welcome-text">Hello <strong>${user.name}</strong>,</p>
          <p>Your Car Rentals account password has been successfully reset!</p>
          
          <div class="details">
            <div style="margin: 10px 0; font-size: 16px;"><strong>Reset Time:</strong> ${new Date().toLocaleString(
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
            <div style="margin: 10px 0; font-size: 16px;"><strong>Account:</strong> ${
              user.email
            }</div>
          </div>

          <p>You can now log in to your account using your new password. Ready to get back on the road?</p>
          
          <p style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-radius: 5px; color: #856404;">
            <strong>Security Reminder:</strong> If you didn't make this change, please contact our support team immediately.
          </p>
        </div>
        <div class="footer">
          <p>If you experience any problems, kindly contact us at <a href="mailto:support@carrentals.com" class="support-link">support@carrentals.com</a></p>
          <p><strong>Best regards,<br>Car Rentals Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail(
    user.email,
    '✅ Car Rentals - Password Reset Successful',
    successEmailHtml
  )

  res.json({ success: true, message: 'Password reset successful' })
}

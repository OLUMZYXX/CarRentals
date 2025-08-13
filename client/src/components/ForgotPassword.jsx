import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const ForgotPassword = () => {
  const { axios } = useAppContext()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSendCode = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/user/forgot-password', { email })
      if (data.success) {
        toast.success('Reset code sent to your email')
        setStep(2)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error sending reset code')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/user/reset-password', {
        code,
        newPassword,
        confirmPassword,
      })
      if (data.success) {
        toast.success('Password reset successful!')
        setStep(1)
        setEmail('')
        setCode('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error resetting password')
    }
  }

  return (
    <div className='max-w-md mx-auto mt-16 p-6 bg-white rounded shadow'>
      {step === 1 ? (
        <form onSubmit={handleSendCode} className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold mb-2'>Forgot Password</h2>
          <input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='border p-2 rounded cursor-pointer'
          />
          <button
            type='submit'
            className='bg-primary text-white py-2 rounded cursor-pointer'
          >
            Send Reset Code
          </button>
          <button
            type='button'
            className='text-primary underline mt-2 cursor-pointer'
            onClick={() => setStep(1)}
          >
            Back to Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold mb-2'>Reset Password</h2>
          <input
            type='text'
            placeholder='Enter reset code from email'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className='border p-2 rounded cursor-pointer'
          />
          <input
            type='password'
            placeholder='New password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className='border p-2 rounded cursor-pointer'
          />
          <input
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='border p-2 rounded cursor-pointer'
          />
          <button
            type='submit'
            className='bg-primary text-white py-2 rounded cursor-pointer'
          >
            Reset Password
          </button>
          <button
            type='button'
            className='text-primary underline mt-2 cursor-pointer'
            onClick={() => setStep(1)}
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword

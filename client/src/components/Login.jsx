import React, { useState } from 'react'
import ForgotPassword from './ForgotPassword'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
  const {
    setShowLogin,
    axios,
    setToken,
    navigate,
    changeRoleToOwner,
    fetchUser,
  } = useAppContext()
  const [state, setState] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [showOwnerPrompt, setShowOwnerPrompt] = useState(false)
  const [ownerLoading, setOwnerLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (state === 'register' && (!name || !email || !password)) {
      toast.error('All fields are required')
      setIsLoading(false)
      return
    }
    if (state === 'register' && password.length < 8) {
      toast.error('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }
    if (state === 'login' && (!email || !password)) {
      toast.error('Email and password are required')
      setIsLoading(false)
      return
    }

    try {
      const payload =
        state === 'register'
          ? { name, email, password, role }
          : { email, password }

      const { data } = await axios.post(`/api/user/${state}`, payload)

      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        await fetchUser()
        if (state === 'register' && role === 'user') {
          setShowOwnerPrompt(true)
        } else {
          navigate('/')
          setShowLogin(false)
          toast.success(
            `${
              state === 'login' ? 'Logged in' : 'Account created'
            } successfully!`
          )
        }
      } else {
        toast.error(data.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Auth error:', error)

      if (error.response) {
        const message = error.response.data?.message || 'Server error occurred'
        toast.error(message)
      } else if (error.request) {
        toast.error('Unable to connect to server')
      } else {
        toast.error(error.message || 'An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
        setShowForgot(false)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error resetting password')
    }
  }
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { data } = await axios.post('/api/user/google-login', {
        token: credentialResponse.credential,
      })
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        await fetchUser()
        navigate('/')
        setShowLogin(false)
        toast.success('Logged in with Google!')
      } else {
        toast.error(data.message || 'Google login failed')
      }
    } catch (error) {
      console.log(error)
      toast.error('Google login error')
    }
  }

  return (
    <>
      {showForgot ? (
        <div className='fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm'>
          <div className='w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all'>
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5 text-center'>
              <div className='flex items-center justify-center mb-1'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 8A6 6 0 006 8v1H3a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V9a1 1 0 00-1-1h-1V8zM8 8a4 4 0 118 0v1H8V8z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h1 className='text-xl font-bold text-white'>Car Rentals</h1>
              </div>
              <p className='text-white/90 text-xs'>
                {step === 1 ? 'Reset your password' : 'Create new password'}
              </p>
            </div>

            <div className='px-8 py-6 space-y-4'>
              {step === 1 ? (
                <>
                  <div className='text-center mb-4'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                      Forgot Password?
                    </h2>
                    <p className='text-sm text-gray-600'>
                      Enter your email and we'll send you a reset code
                    </p>
                  </div>

                  <div>
                    <input
                      type='email'
                      placeholder='Enter your email address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm'
                    />
                  </div>

                  <button
                    onClick={handleSendCode}
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-sm'
                  >
                    Send Reset Code
                  </button>
                </>
              ) : (
                <>
                  <div className='text-center mb-4'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                      Reset Password
                    </h2>
                    <p className='text-sm text-gray-600'>
                      Enter the code sent to your email and create a new
                      password
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <input
                      type='text'
                      placeholder='Enter reset code'
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm'
                    />

                    <input
                      type='password'
                      placeholder='New password (min 8 chars)'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm'
                    />

                    <input
                      type='password'
                      placeholder='Confirm new password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm'
                    />
                  </div>

                  <button
                    onClick={handleResetPassword}
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-sm'
                  >
                    Reset Password
                  </button>
                </>
              )}

              <div className='text-center pt-2'>
                <button
                  type='button'
                  onClick={() => setShowForgot(false)}
                  className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-sm'
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setShowLogin(false)}
          className='fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all'
          >
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5 text-center'>
              <div className='flex items-center justify-center mb-1'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                    <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z' />
                  </svg>
                </div>
                <h1 className='text-xl font-bold text-white'>Car Rentals</h1>
              </div>
              <p className='text-white/90 text-xs'>
                {state === 'login' ? 'Welcome back!' : 'Join our community'}
              </p>
            </div>

            <div className='px-8 py-6 space-y-4'>
              <div className='flex bg-gray-100 rounded-lg p-1'>
                <button
                  type='button'
                  onClick={() => setState('login')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    state === 'login'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  type='button'
                  onClick={() => setState('register')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    state === 'register'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {state === 'register' && (
                <div className='space-y-3'>
                  <div>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      placeholder='Full name'
                      className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm'
                      type='text'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <label
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        role === 'user'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type='radio'
                        name='role'
                        value='user'
                        checked={role === 'user'}
                        onChange={() => setRole('user')}
                        className='sr-only'
                      />
                      <div className='text-center'>
                        <div className='text-xs font-medium'>🚗 Renter</div>
                      </div>
                    </label>
                    <label
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        role === 'owner'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type='radio'
                        name='role'
                        value='owner'
                        checked={role === 'owner'}
                        onChange={() => setRole('owner')}
                        className='sr-only'
                      />
                      <div className='text-center'>
                        <div className='text-xs font-medium'>🔑 Owner</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder='Email address'
                  className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm'
                  type='email'
                  required
                  autoComplete='username'
                />
              </div>

              <div className='relative'>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder={
                    state === 'register' ? 'Password (min 8 chars)' : 'Password'
                  }
                  className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm'
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={
                    state === 'register' ? 'new-password' : 'current-password'
                  }
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600'
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                        clipRule='evenodd'
                      />
                      <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                    </svg>
                  ) : (
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                      <path
                        fillRule='evenodd'
                        d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                onClick={onSubmitHandler}
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm'
              >
                {isLoading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    {state === 'register' ? 'Creating...' : 'Signing in...'}
                  </>
                ) : state === 'register' ? (
                  'Create Account'
                ) : (
                  'Sign In'
                )}
              </button>

              <div className='relative my-4'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-xs'>
                  <span className='px-2 bg-white text-gray-500'>Or</span>
                </div>
              </div>

              <div className='flex justify-center'>
                <div className='transform scale-90'>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => toast.error('Google login failed')}
                    theme='outline'
                    size='medium'
                    text='signin_with'
                  />
                </div>
              </div>

              <div className='text-center pt-2'>
                {state === 'register' ? (
                  <p className='text-gray-600 text-xs'>
                    Already have an account?{' '}
                    <button
                      type='button'
                      onClick={() => setState('login')}
                      className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors'
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <>
                    <p className='text-gray-600 text-xs'>
                      Don't have an account?{' '}
                      <button
                        type='button'
                        onClick={() => setState('register')}
                        className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors'
                      >
                        Sign up
                      </button>
                    </p>
                    <p className='text-gray-600 text-xs mt-2'>
                      <button
                        type='button'
                        onClick={() => setShowForgot(true)}
                        className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors'
                      >
                        Forgot password?
                      </button>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showOwnerPrompt && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3'>
              <svg
                className='w-6 h-6 text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h2 className='text-lg font-bold text-gray-900 mb-2'>
              Become a Car Owner?
            </h2>
            <p className='text-gray-600 mb-4 text-sm'>
              List your vehicles and start earning. Upgrade to access dashboard
              features.
            </p>
            <button
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-2 flex items-center justify-center text-sm'
              onClick={async () => {
                setOwnerLoading(true)
                const success = await changeRoleToOwner()
                setOwnerLoading(false)
                if (success) {
                  setShowOwnerPrompt(false)
                  setShowLogin(false)
                  navigate('/owner')
                }
              }}
              disabled={ownerLoading}
            >
              {ownerLoading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Upgrading...
                </>
              ) : (
                '🚗 Yes, Become Owner'
              )}
            </button>
            <button
              className='w-full text-gray-500 hover:text-gray-700 py-2 transition-colors text-sm'
              onClick={() => {
                setShowOwnerPrompt(false)
                setShowLogin(false)
                navigate('/')
                toast('You can become an owner anytime from your dashboard.')
              }}
            >
              Continue as Renter
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Login

import React from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Login = () => {
  const {
    setShowLogin,
    axios,
    setToken,
    navigate,
    changeRoleToOwner,
    fetchUser,
  } = useAppContext()
  const [state, setState] = React.useState('login')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [role, setRole] = React.useState('user')
  const [showOwnerPrompt, setShowOwnerPrompt] = React.useState(false)
  const [ownerLoading, setOwnerLoading] = React.useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === 'register' && (!name || !email || !password)) {
      toast.error('All fields are required')
      return
    }
    if (state === 'register' && password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (state === 'login' && (!email || !password)) {
      toast.error('Email and password are required')
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
        // Only show owner prompt if registering as user (not owner) and just registered
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
    }
  }

  return (
    <>
      <div
        onClick={() => setShowLogin(false)}
        className='fixed top-0 bottom-0 left-0 right-0 z-50 flex justify-center items-center text-sm text-gray-600 bg-black/50'
      >
        <form
          onSubmit={onSubmitHandler}
          onClick={(e) => e.stopPropagation()}
          className='flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white'
        >
          <p className='text-2xl font-medium m-auto'>
            <span className='text-primary'>User</span>{' '}
            {state === 'login' ? 'Login' : 'Sign Up'}
          </p>

          {state === 'register' && (
            <>
              <div className='w-full'>
                <p>Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder='Enter your full name'
                  className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                  type='text'
                  required
                />
              </div>
              <div className='w-full'>
                <p>Register as</p>
                <div className='flex gap-4 mt-1'>
                  <label className='flex items-center gap-1 cursor-pointer'>
                    <input
                      type='radio'
                      name='role'
                      value='user'
                      checked={role === 'user'}
                      onChange={() => setRole('user')}
                    />
                    User
                  </label>
                  <label className='flex items-center gap-1 cursor-pointer'>
                    <input
                      type='radio'
                      name='role'
                      value='owner'
                      checked={role === 'owner'}
                      onChange={() => setRole('owner')}
                    />
                    Owner
                  </label>
                </div>
              </div>
            </>
          )}

          <div className='w-full'>
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder='Enter your email'
              className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
              type='email'
              required
            />
          </div>

          <div className='w-full'>
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder={
                state === 'register'
                  ? 'Create password (min 8 chars)'
                  : 'Enter your password'
              }
              className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
              type='password'
              required
            />
          </div>

          {state === 'register' ? (
            <p>
              Already have account?{' '}
              <span
                onClick={() => setState('login')}
                className='text-primary cursor-pointer hover:underline'
              >
                click here
              </span>
            </p>
          ) : (
            <p>
              Create an account?{' '}
              <span
                onClick={() => setState('register')}
                className='text-primary cursor-pointer hover:underline'
              >
                click here
              </span>
            </p>
          )}

          <button
            type='submit'
            className='bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50'
          >
            {state === 'register' ? 'Create Account' : 'Login'}
          </button>
        </form>
      </div>

      {/* Owner Prompt Modal */}
      {showOwnerPrompt && (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='bg-white rounded-lg shadow-lg p-8 w-80 flex flex-col items-center'>
            <h2 className='text-xl font-semibold mb-4 text-center'>
              Become an Owner?
            </h2>
            <p className='mb-6 text-center'>
              Do you want to become an owner and access the dashboard features?
            </p>
            <button
              className='bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 w-full mb-2 disabled:opacity-50'
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
              {ownerLoading ? 'Becoming Owner...' : 'Yes, Become Owner'}
            </button>
            <button
              className='mt-2 text-gray-500 hover:underline w-full'
              onClick={() => {
                setShowOwnerPrompt(false)
                setShowLogin(false)
                navigate('/')
                toast('You can become an owner anytime from your dashboard.')
              }}
            >
              No, Continue as User
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Login

import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY

  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [cars, setCars] = useState([])

  const fetchUser = React.useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/data')
      if (data.success) {
        setUser(data.user)
        setIsOwner(data.user.role === 'owner')
      } else {
        setUser(null)
        setIsOwner(false)
        localStorage.removeItem('token')
        setToken(null)
        axios.defaults.headers.common['Authorization'] = ''
        toast.error(data.message || 'Authentication failed')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setUser(null)
      setIsOwner(false)
      localStorage.removeItem('token')
      setToken(null)
      axios.defaults.headers.common['Authorization'] = ''
      toast.error('Authentication failed. Please login again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars')
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeRoleToOwner = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role')

      if (data.success) {
        if (data.user) {
          setUser(data.user)
          setIsOwner(data.user.role === 'owner')
        } else {
          setIsOwner(true)
        }
        toast.success(data.message || 'You are now an owner!')
        return true
      } else {
        toast.error(data.message || 'Failed to become owner')
        return false
      }
    } catch (error) {
      console.error('Error becoming owner:', error)
      toast.error('Failed to become owner. Please try again.')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsOwner(false)
    axios.defaults.headers.common['Authorization'] = ''
    toast.success('Logged out successfully')
    navigate('/')
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
      fetchCars()
    } else {
      setLoading(false)
    }
  }, [token, fetchUser])

  return (
    <AppContext.Provider
      value={{
        navigate,
        currency,
        token,
        setToken,
        user,
        setUser,
        isOwner,
        setIsOwner,
        loading,
        showLogin,
        setShowLogin,
        axios,
        logout,
        fetchUser,
        fetchCars,
        changeRoleToOwner,
        cars,
        setCars,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        toast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}

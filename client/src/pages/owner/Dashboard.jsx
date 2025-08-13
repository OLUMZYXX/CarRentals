import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { axios, isOwner, currency, setUser, setToken } = useAppContext()
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(false)
  const dashboardCards = [
    { title: 'Total Cars', value: data.totalCars, icon: assets.carIconColored },
    {
      title: 'Total Bookings',
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: 'Pending',
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: 'Confirmed',
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ]

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      if (!isOwner) {
        const { data: roleData } = await axios.post('/api/owner/change-role')
        if (roleData.success && roleData.user) {
          setUser(roleData.user)
          if (roleData.token) {
            setToken(roleData.token)
            localStorage.setItem('token', roleData.token)
          }
          toast.success('Role changed to owner!')
        } else {
          toast.error(roleData.message || 'Failed to change role')
          setLoading(false)
          return
        }
      }
      const { data: dashData } = await axios.get('/api/owner/dashboard')
      if (dashData.success) {
        setData(dashData.data)
      } else {
        toast.error(dashData.message)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to fetch dashboard data')
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchDashboardData()
  }, [])
  return (
    <motion.div
      className='px-4 pt-10 md:px-10 flex-1'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Title
          title='Admin Dashboard'
          subtitle='Monitor overall platform performance including total cars, bookings, revenue, and recent activities'
        />
      </motion.div>

      {loading ? (
        <motion.div
          className='flex justify-center items-center h-40'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            className='text-primary text-lg'
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading dashboard...
          </motion.span>
        </motion.div>
      ) : (
        <>
          <motion.div
            className='my-8 grid  gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
          >
            {dashboardCards.map((card, index) => (
              <motion.div
                key={index}
                className='rounded-md border items-center justify-between border-borderColor p-6 shadow hover:shadow-md transition-all'
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transition: { type: 'spring', stiffness: 300, damping: 30 },
                }}
              >
                <div className='flex items-center justify-between'>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <h1 className='text-sm text-gray-500'>{card.title}</h1>
                    <motion.p
                      className='text-lg font-bold text-gray-800'
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.5,
                        type: 'spring',
                        stiffness: 150,
                      }}
                    >
                      {card.value}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className='flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: index * 0.1 + 0.6,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 10,
                      transition: { type: 'spring', stiffness: 400 },
                    }}
                  >
                    <img src={card.icon} alt={card.title} className='h-8 w-8' />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className='flex flex-wrap items-start gap-6 mb-8 w-full'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              className='w-full md:flex-1 p-6 border border-borderColor rounded-xl bg-white shadow-sm'
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
              whileHover={{
                boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                transition: { duration: 0.3 },
              }}
            >
              <motion.h2
                className='text-xl font-semibold text-gray-800'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Recent Bookings
              </motion.h2>
              <motion.p
                className='text-gray-500 text-sm mb-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Latest customer bookings
              </motion.p>

              {data.recentBookings.length === 0 ? (
                <motion.p
                  className='text-gray-400 text-sm'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  No recent bookings.
                </motion.p>
              ) : (
                <motion.div
                  className='space-y-4'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, staggerChildren: 0.1 }}
                >
                  {data.recentBookings.map((booking, i) => (
                    <motion.div
                      key={i}
                      className='flex items-center justify-between border-t pt-4 first:border-none first:pt-0'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                      whileHover={{
                        x: 5,
                        transition: { type: 'spring', stiffness: 300 },
                      }}
                    >
                      <div className='flex items-center gap-4'>
                        <motion.div
                          className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <img
                            src={assets.listIconColored}
                            alt='Booking Icon'
                            className='w-6 h-6'
                          />
                        </motion.div>
                        <div>
                          <p className='font-medium text-gray-800'>
                            {booking.car.brand} {booking.car.model}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {booking.createdAt.split('T')[0]}
                          </p>
                        </div>
                      </div>

                      <div className='flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-600'>
                        <motion.span
                          className='text-gray-700 font-medium'
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {currency}
                          {booking.price}
                        </motion.span>
                        <motion.span
                          className={`px-3 py-1 rounded-full border text-xs font-medium ${
                            booking.status === 'Confirmed'
                              ? 'text-green-600 border-green-300 bg-green-50'
                              : booking.status === 'Pending'
                              ? 'text-yellow-600 border-yellow-300 bg-yellow-50'
                              : 'text-gray-600 border-gray-300 bg-gray-50'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 1.2 + i * 0.1,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {booking.status}
                        </motion.span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className='w-full md:max-w-xs p-6 border border-borderColor rounded-xl bg-white shadow-sm'
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
              whileHover={{
                boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                transition: { duration: 0.3 },
              }}
            >
              <motion.h2
                className='text-xl font-semibold text-gray-800'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Monthly Revenue
              </motion.h2>
              <motion.p
                className='text-gray-500 text-sm mb-6'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Revenue for current month
              </motion.p>
              <motion.p
                className='text-3xl font-bold text-primary'
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.1,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 400 },
                }}
              >
                {currency}
                {data.monthlyRevenue}
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

export default Dashboard

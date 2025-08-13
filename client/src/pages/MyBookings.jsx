import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const { axios, currency, token } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.data)
      } else {
        setBookings([])
        toast.error(data.message || 'Failed to fetch bookings')
      }
    } catch {
      setBookings([])
      toast.error('Error fetching bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchMyBookings()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [token])

  if (!token && !loading) {
    return (
      <div className='px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-32 mt-16 text-sm w-full'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-[#120735]'>My Bookings</h1>
          <p className='text-gray-500'>Login to show your bookings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-32 mt-16 text-sm w-full'>
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold text-[#120735]'>My Bookings</h1>
        <p className='text-gray-500'>View and manage your all car bookings</p>
      </div>

      <div className='space-y-8'>
        {bookings.map((booking, i) => (
          <div
            key={booking._id}
            className='w-full grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-gray-200 rounded-lg shadow-sm'
          >
            {/* Car Image and Info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img
                  src={booking.car.image}
                  alt={`${booking.car.brand} ${booking.car.model}`}
                  className='w-full aspect-video object-cover'
                />
              </div>
              <p className='text-lg font-semibold'>
                {booking.car.brand} {booking.car.model}
              </p>
              <p className='text-gray-500 text-sm'>
                {booking.car.year} • {booking.car.category} •{' '}
                {booking.car.location}
              </p>
            </div>

            {/* Booking Details */}
            <div className='md:col-span-2 space-y-4'>
              <div className='flex items-center gap-3'>
                <p className='px-3 py-1.5 bg-gray-100 rounded text-sm'>
                  Booking #{i + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {booking.status}
                </p>
              </div>

              <div className='flex items-start gap-3'>
                <img
                  src={assets.calendar_icon_colored}
                  alt='calendar'
                  className='w-4 h-4 mt-1'
                />
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>
                    {booking.pickupDate.split('T')[0]} to{' '}
                    {booking.returnDate.split('T')[0]}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <img
                  src={assets.location_icon_colored}
                  alt='location'
                  className='w-4 h-4 mt-1'
                />
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className='md:col-span-1 flex flex-col justify-between text-sm text-right'>
              <div>
                <p className='text-gray-500'>Total Price</p>
                <h1 className='text-2xl font-bold text-primary'>
                  {currency}
                  {booking.price}
                </h1>
              </div>
              <p className='text-gray-400 mt-4'>
                Booked on {booking.createdAt.split('T')[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings

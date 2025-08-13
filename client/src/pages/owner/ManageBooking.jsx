import React, { useEffect, useState } from 'react'

import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBooking = () => {
  const { axios, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const fetchOwnerBookings = React.useCallback(async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      if (data.success) {
        setBookings(data.data)
      } else {
        toast.error(data.message || 'Failed to fetch bookings')
      }
    } catch (error) {
      toast.error(error.message || error.message)
    }
  }, [axios])
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status,
      })
      if (data.success) {
        toast.success('Booking status updated successfully')
        fetchOwnerBookings()
      } else {
        toast.error(data.message || 'Failed to update booking status')
      }
    } catch (error) {
      toast.error(error.message || error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [fetchOwnerBookings])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title='Manage Bookings'
        subtitle='Track all customer bookings, approve or cancel requests, and manage booking statuses'
      />

      <div className='w-full mt-6 rounded-md border border-borderColor overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm text-gray-600 min-w-[800px]'>
          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, i) => (
              <tr
                key={i}
                className='border-t border-borderColor hover:bg-gray-50 text-gray-500'
              >
                <td className='p-3 flex items-center gap-3'>
                  <img
                    src={booking.car.image}
                    alt={booking.name || `Car ${i}`}
                    className='h-12 w-12 rounded-md aspect-square object-cover'
                  />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>
                      {booking.car.brand} {booking.car.model}
                    </p>
                    {/* <p className='text-xs text-gray-500'>
                      {booking.seating_capacity} seats • {booking.transmission}
                    </p> */}
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate?.split('T')[0]} to{' '}
                  {booking.returnDate?.split('T')[0]}
                </td>
                <td className='p-3'>
                  {currency}
                  {booking.price}
                </td>
                <td className='p-3 max-md:hidden'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-500'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select
                      onChange={(e) =>
                        changeBookingStatus(booking._id, e.target.value)
                      }
                      value={booking.status}
                      className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'
                    >
                      <option value='pending'>Pending</option>
                      <option value='cancelled'>Cancelled</option>
                      <option value='confirmed'>Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-500'
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBooking

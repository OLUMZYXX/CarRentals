import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext()
  const [cars, setCars] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [carToDelete, setCarToDelete] = useState(null)

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars')
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message || 'Failed to fetch cars')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId })
      if (data.success) {
        toast.success('Car availability toggled successfully')
        fetchOwnerCars()
      } else {
        toast.error(data.message || 'Failed to toggle availability')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
  const handleDeleteClick = (carId) => {
    setCarToDelete(carId)
    setShowDeleteModal(true)
  }

  const confirmDeleteCar = async () => {
    if (!carToDelete) return
    try {
      const { data } = await axios.post('/api/owner/delete-car', {
        carId: carToDelete,
      })
      if (data.success) {
        toast.success('Car deleted successfully')
        fetchOwnerCars()
      } else {
        toast.error(data.message || 'Failed to delete car')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setShowDeleteModal(false)
      setCarToDelete(null)
    }
  }

  const cancelDeleteCar = () => {
    setShowDeleteModal(false)
    setCarToDelete(null)
  }

  useEffect(() => {
    isOwner && fetchOwnerCars()
  }, [isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title='Manage Cars'
        subtitle='View all listed cars, update their details, or remove them from the booking platform'
      />

      <div className='w-full mt-6 rounded-md border border-borderColor overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm text-gray-600 min-w-[800px]'>
          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, i) => (
              <tr
                key={i}
                className='border-t border-borderColor hover:bg-gray-50'
              >
                <td className='p-3 flex items-center gap-3'>
                  <img
                    src={car.image}
                    alt={car.name || `Car ${i}`}
                    className='h-12 w-12 rounded-md object-cover'
                  />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>
                      {car.brand} {car.model}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {car.seating_capacity} seats • {car.transmission}
                    </p>
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3'>
                  {currency}
                  {car.pricePerDay}/day
                </td>
                <td className='p-3 max-md:hidden'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailable
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className='p-3 flex items-center gap-4'>
                  <img
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt='Toggle visibility'
                    className='cursor-pointer hover:opacity-70 transition'
                    onClick={() => toggleAvailability(car._id)}
                  />
                  <img
                    src={assets.delete_icon}
                    alt='Delete'
                    className='cursor-pointer hover:opacity-70 transition'
                    onClick={() => handleDeleteClick(car._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}

      {showDeleteModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 animate-fadeIn'>
            <div className='flex flex-col items-center'>
              {/* Warning Icon */}
              <div className='w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.634-1.142 
                 1.053-2.053L13.053 4.947c-.526-.79-1.58-.79-2.106 
                 0L4.03 16.947c-.581.911-.001 2.053 
                 1.053 2.053z'
                  />
                </svg>
              </div>

              <h2 className='text-lg font-semibold text-gray-800'>
                Delete Car?
              </h2>
              <p className='text-gray-600 text-sm mt-1 text-center'>
                Are you sure you want to delete this car? This action cannot be
                undone.
              </p>

              <div className='flex gap-3 mt-5'>
                <button
                  className='px-5 py-2 cursor-pointer bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition'
                  onClick={confirmDeleteCar}
                >
                  Yes, Delete
                </button>
                <button
                  className='px-5 py-2 cursor-pointer bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition'
                  onClick={cancelDeleteCar}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCars

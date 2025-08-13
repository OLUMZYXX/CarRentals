import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const { cars, axios } = useAppContext()

  const isSearchData = pickupLocation && pickupDate && returnDate

  const [input, setInput] = useState('')
  const [baseCars, setBaseCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])

  // Apply text filter to the current baseCars (either all cars or available cars)
  const applyFilter = () => {
    if (input.trim() === '') {
      setFilteredCars(baseCars)
      return
    }
    const searchTerm = input.toLowerCase()
    const filtered = baseCars.filter((car) => {
      return (
        (car.brand && car.brand.toLowerCase().includes(searchTerm)) ||
        (car.model && car.model.toLowerCase().includes(searchTerm)) ||
        (car.category && car.category.toLowerCase().includes(searchTerm)) ||
        (car.transmission &&
          car.transmission.toLowerCase().includes(searchTerm)) ||
        (car.features && car.features.toLowerCase().includes(searchTerm))
      )
    })
    setFilteredCars(filtered)
  }

  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      })
      if (data.success && data.data && data.data.length > 0) {
        setBaseCars(data.data)
        setFilteredCars(data.data)
      } else {
        setBaseCars([])
        setFilteredCars([])
        toast('No cars available for the selected dates and location.')
      }
    } catch {
      setBaseCars([])
      setFilteredCars([])
      toast.error('Error fetching available cars.')
    }
  }
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability()
    } else {
      setBaseCars(cars)
      setFilteredCars(cars)
    }
    // eslint-disable-next-line
  }, [cars, isSearchData, pickupLocation, pickupDate, returnDate])

  useEffect(() => {
    applyFilter()
    // eslint-disable-next-line
  }, [input, baseCars])
  // input state moved above
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title
          title='Available Cars'
          subTitle='Browse our selection of premium vehicles available for your next adventure'
        />
        <div className='items-center flex bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img
            src={assets.search_icon}
            alt='search'
            className='w-4.5 h-4.5 mr-2'
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />
          <img
            src={assets.filter_icon}
            alt='search'
            className='w-4.5 h-4.5 mr-2'
          />
        </div>
      </div>
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 px-20 max-w-7xl mx-auto'>
          Showing {filteredCars.length} Cars
        </p>
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {filteredCars.map((car, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Cars

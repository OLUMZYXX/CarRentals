import React, { useState, useEffect } from 'react'
import { assets, cityList } from '../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(
      '/cars?pickupLocation=' +
        pickupLocation +
        '&pickupDate=' +
        pickupDate +
        '&returnDate=' +
        returnDate
    )
  }

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center overflow-hidden'>
      <AnimatePresence>
        {isLoaded && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='text-4xl md:text-5xl font-semibold'
            >
              Luxury Cars on Rent
            </motion.h1>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'
            >
              <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='flex flex-col items-start gap-2'
                >
                  <select
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className='focus:ring-2 focus:ring-primary transition-all'
                  >
                    <option value=''>Pickup Location</option>
                    {cityList.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <motion.p
                    key={pickupLocation || 'empty'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='px-1 text-sm text-gray-500'
                  >
                    {pickupLocation ? pickupLocation : 'Please select location'}
                  </motion.p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='flex flex-col items-start gap-2'
                >
                  <label htmlFor='pickup-date'>Pick-up Date</label>
                  <input
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    type='date'
                    id='pickup-date'
                    min={new Date().toISOString().split('T')[0]}
                    className='text-sm text-gray-500 focus:ring-2 focus:ring-primary transition-all'
                    required
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='flex flex-col items-start gap-2'
                >
                  <label htmlFor='return-date'>Return Date</label>
                  <input
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    type='date'
                    id='return-date'
                    min={new Date().toISOString().split('T')[0]}
                    className='text-sm text-gray-500 focus:ring-2 focus:ring-primary transition-all'
                    required
                  />
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer transition-colors'
              >
                <img
                  src={assets.search_icon}
                  alt='Search'
                  className='brightness-300'
                />
                Search
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className='relative'
            >
              <img
                src={assets.main_car}
                alt='car'
                className='max-h-74 transition-transform duration-300 hover:scale-105'
              />
              <motion.div
                className='absolute -bottom-5 left-0 right-0 h-2 bg-gray-200 rounded-full'
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Hero

import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { motion } from 'framer-motion'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {
  const { axios, currency } = useAppContext()
  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return

    if (!image) {
      toast.error('Car image is required')
      return
    }
    if (
      !car.brand ||
      !car.model ||
      !car.year ||
      !car.pricePerDay ||
      !car.category ||
      !car.transmission ||
      !car.fuel_type ||
      !car.seating_capacity ||
      !car.location ||
      !car.description
    ) {
      toast.error('All fields are required')
      return
    }
    const yearNum = Number(car.year)
    if (
      isNaN(yearNum) ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear() + 1
    ) {
      toast.error('Please enter a valid year')
      return
    }
    const priceNum = Number(car.pricePerDay)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price')
      return
    }
    const seatNum = Number(car.seating_capacity)
    if (isNaN(seatNum) || seatNum <= 0) {
      toast.error('Please enter a valid seating capacity')
      return
    }

    setIsLoading(true)
    try {
      const carToSend = {
        ...car,
        year: yearNum,
        pricePerDay: priceNum,
        seating_capacity: seatNum,
      }
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(carToSend))
      const { data } = await axios.post('/api/owner/add-car', formData)
      if (data.success) {
        toast.success('Car listed successfully!')
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        })
      } else {
        toast.error(data.message || 'Failed to add car')
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'An error occurred while adding the car'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkResult, setBulkResult] = useState(null)

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBulkUploading(true)
    setBulkResult(null)
    let cars = []
    try {
      const reader = new FileReader()
      reader.onload = async (evt) => {
        let data = evt.target.result
        let parsed
        if (file.name.endsWith('.csv')) {
          parsed = XLSX.read(data, { type: 'binary' })
        } else {
          parsed = XLSX.read(data, { type: 'array' })
        }
        const sheet = parsed.Sheets[parsed.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(sheet)
        cars = json
        let success = 0,
          fail = 0
        for (let car of cars) {
          try {
            await axios.post('/api/owner/add-car', {
              carData: JSON.stringify(car),
            })
            success++
          } catch {
            fail++
          }
        }
        setBulkResult({ success, fail })
        setBulkUploading(false)
      }
      if (file.name.endsWith('.csv')) {
        reader.readAsBinaryString(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    } catch {
      setBulkResult({ success: 0, fail: 0, error: 'Failed to parse file' })
      setBulkUploading(false)
    }
  }

  return (
    <motion.div
      className='px-4 py-10 md:px-10 w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className='mb-8 flex justify-end'
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className='text-right'>
          <label className='block font-semibold mb-2'>
            Bulk Upload Cars (CSV or Excel):
          </label>
          <motion.label
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer inline-block transition-colors'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {bulkUploading ? 'Uploading...' : 'Choose File'}
            <input
              type='file'
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              onChange={handleBulkUpload}
              disabled={bulkUploading}
              className='hidden'
            />
          </motion.label>
          {bulkUploading && (
            <motion.div
              className='text-blue-600 mt-2'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Uploading cars...
            </motion.div>
          )}
          {bulkResult && (
            <motion.div
              className='mt-2'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className='text-green-600'>
                Success: {bulkResult.success}
              </span>
              <span className='ml-4 text-red-600'>
                Failed: {bulkResult.fail}
              </span>
              {bulkResult.error && (
                <span className='ml-4 text-red-600'>{bulkResult.error}</span>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Title
          title='Add New Car'
          subtitle='Fill in details to list a new car for booking, including pricing, availability, and car specifications.'
        />
      </motion.div>

      <motion.form
        onSubmit={onSubmitHandler}
        className='flex flex-col gap-5 text-gray-500 text-sm mt-6 w-full max-w-3xl'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className='flex items-center gap-4 w-full'
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          <motion.label
            htmlFor='car-image'
            className='cursor-pointer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt='Car Upload'
              className='h-18 w-28 object-cover rounded-md'
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
            />
          </motion.label>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className='text-gray-600 text-sm'>
              Upload a picture of your car
            </p>
            <input
              type='file'
              id='car-image'
              accept='image/*'
              hidden
              onChange={(e) => {
                if (e.target.files[0]) setImage(e.target.files[0])
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Brand</label>
            <motion.input
              type='text'
              placeholder='e.g. BMW, Mercedes, Audi... '
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full'
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Model</label>
            <motion.input
              type='text'
              placeholder='e.g. X5, E-Class, M4...'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full'
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Year</label>
            <motion.input
              type='Number'
              placeholder='2025'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full'
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Daily Price ({currency})</label>
            <motion.input
              type='number'
              placeholder='e.g. 100'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full'
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Category</label>
            <motion.select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className='px-3 py-2 mt-1 border border-borderColor outline-none rounded-md w-full'
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <option value=''>Select a category</option>
              <option value='Sedan'>Sedan</option>
              <option value='SUV'>SUV</option>
              <option value='Van'>Van</option>
            </motion.select>
          </motion.div>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, staggerChildren: 0.1 }}
        >
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Transmission</label>
            <motion.select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className='px-3 py-2 mt-1 border border-borderColor outline-none rounded-md w-full'
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <option value=''>Select a Transmission</option>
              <option value='Automatic'>Automatic</option>
              <option value='Manual'>Manual</option>
              <option value='Semi-Automatic'>Semi-Automatic</option>
            </motion.select>
          </motion.div>
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Fuel Type</label>
            <motion.select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className='px-3 py-2 mt-1 border border-borderColor outline-none rounded-md w-full'
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <option value=''>Select a fuel type</option>
              <option value='Gas'>Gas</option>
              <option value='Diesel'>Diesel</option>
              <option value='Petrol'>Petrol</option>
              <option value='Electric'>Electric</option>
              <option value='Hybrid'>Hybrid</option>
            </motion.select>
          </motion.div>
          <motion.div
            className='flex flex-col w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <label>Seating Capacity</label>
            <motion.input
              type='number'
              placeholder='5'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full'
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: e.target.value })
              }
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className='flex flex-col w-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <label>Location</label>
          <motion.select
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            value={car.location}
            className='px-3 py-2 mt-1 border border-borderColor outline-none rounded-md w-full'
            whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <option value=''>Select a location</option>
            <option value='New York'>New York</option>
            <option value='Los Angeles'>Los Angeles</option>
            <option value='Houston'>Houston</option>
            <option value='Chicago'>Chicago</option>
          </motion.select>
        </motion.div>

        <motion.div
          className='flex flex-col w-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <label>Description</label>
          <motion.textarea
            rows={5}
            placeholder='Describe your car, its condition, and any notable details...'
            required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full'
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
            whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
            transition={{ type: 'spring', stiffness: 300 }}
          ></motion.textarea>
        </motion.div>

        <motion.button
          type='submit'
          className='bg-primary cursor-pointer px-5 py-3 flex items-center text-white gap-2 font-medium rounded-md mt-3 w-fit'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 150 }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            transition: { type: 'spring', stiffness: 400 },
          }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <motion.img
            src={assets.tick_icon}
            alt=''
            animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
          />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </motion.button>
      </motion.form>
    </motion.div>
  )
}

export default AddCar

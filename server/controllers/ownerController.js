import imagekit from '../configs/imageKit.js'
import Booking from '../models/booking.js'
import Car from '../models/car.js'
import User from '../models/user.js'
import fs from 'fs'
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { role: 'owner' },
      { new: true }
    )
    res.json({
      success: true,
      message: 'Now you can list cars',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Api to List cars
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user
    let car = JSON.parse(req.body.carData)
    const imageFile = req.file
    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path)
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/cars',
    })
    // Optimize through imagekit URL transformation
    var optimizedImageURL = imagekit.url({
      path: response.filePath,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      transformation: [
        {
          width: '1280',
        },
        // Auto compression
        { quality: 'auto' },
        // Convert to modern format
        { format: 'webp' },
      ],
    })
    const image = optimizedImageURL
    console.log('Car data to be saved:', { ...car, owner: _id, image })
    await Car.create({ ...car, owner: _id, image })
    res.json({ success: true, message: 'Car added successfully' })
  } catch (error) {
    console.error('Add Car Error:', error)
    res
      .status(500)
      .json({ success: false, message: error.message || 'Server error' })
  }
}

// Api to list OwnerCars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user
    const cars = await Car.find({ owner: _id })
    res.json({ success: true, cars })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Api to Toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user
    const { carId } = req.body
    const car = await Car.findById(carId)
    if (car.owner.toString() !== _id.toString()) {
      return res.status(404).json({ success: false, message: 'Car not found' })
    }

    car.isAvailable = !car.isAvailable
    await car.save()
    res.json({ success: true, message: 'Car availability toggled', car })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Api to delete car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user
    const { carId } = req.body
    const car = await Car.findById(carId)
    // Checking if the car exists and belongs to the owner
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' })
    }
    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    car.isAvailable = false
    await car.save()
    await Car.findByIdAndDelete(carId)
    res.json({
      success: true,
      message: 'Car deleted successfully' || 'Car Removed',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
// Api to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user
    if (role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    const cars = await Car.find({ owner: _id })
    const bookings = await Booking.find({ owner: _id })
      .populate('car')
      .sort({ createdAt: -1 })
    const pendingBooking = await Booking.find({ owner: _id, status: 'pending' })
    const confirmedBooking = await Booking.find({
      owner: _id,
      status: 'confirmed',
    })

    const monthlyRevenue = bookings
      .filter((booking) => booking.status === 'confirmed')
      .reduce((acc, booking) => acc + booking.price, 0)

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBooking.length,
      completedBookings: confirmedBooking.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    }
    res.json({ success: true, data: dashboardData })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
// Api to update profile image
// In ownerController.js
export const updateProfileImage = async (req, res) => {
  try {
    const { _id } = req.user
    const imageFile = req.file
    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path)
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/profile',
    })
    // Optimize through imagekit URL transformation
    var optimizedImageURL = imagekit.url({
      path: response.filePath,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      transformation: [
        {
          width: '400',
        },
        // Auto compression
        { quality: 'auto' },
        // Convert to modern format
        { format: 'webp' },
      ],
    })
    const image = optimizedImageURL
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { profileImage: image },
      { new: true } // This returns the updated document
    ).select('-password')

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      user: updatedUser, // Send back the updated user
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

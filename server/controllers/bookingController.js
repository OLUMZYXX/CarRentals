import Booking from '../models/booking.js'
import Car from '../models/Car.js'

//function to check Availibility of Car for a given Date

const checkAvailability = async (car, startDate, endDate) => {
  const bookings = await Booking.find({
    car,
    // Find bookings that overlap with the requested range
    $and: [
      { pickupDate: { $lte: endDate } },
      { returnDate: { $gte: startDate } },
    ],
  })
  return bookings.length === 0
}

// Api to check Availability of Cars for the given Date and location Controller function
export const checkCarAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body
    const car = await Car.find({
      location,
      isAvailable: true,
    })
    const availableCarsPromise = car.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      )
      return { ...car._doc, isAvailable: isAvailable }
    })
    let availableCars = await Promise.all(availableCarsPromise)
    availableCars = availableCars.filter((car) => car.isAvailable === true)
    res.status(200).json({
      success: true,
      message: 'Cars fetched successfully',
      data: availableCars,
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message })
  }
}

// Api to book a Car  function
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user
    const { car, pickupDate, returnDate } = req.body
    const isAvailable = await checkAvailability(car, pickupDate, returnDate)
    if (!isAvailable) {
      return res.json({
        success: false,
        message: 'Car is not available for the selected dates',
      })
    }
    const carData = await Car.findById(car)
    // calculate price based on pickup and return date
    const picked = new Date(pickupDate)
    const returned = new Date(returnDate)
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
    const price = carData.pricePerDay * noOfDays

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    })
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message })
  }
}

// Api to list user Bookings

export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user
    const bookings = await Booking.find({ user: _id })
      .populate('car')
      .sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      message: 'User bookings fetched successfully',
      data: bookings,
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message })
  }
}

// Api to get owner Bookings

export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only owners can view this data.',
      })
    }
    const booking = await Booking.find({ owner: req.user._id })
      .populate('car user')
      .select('-user.password')
      .sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      message: 'Owner bookings fetched successfully',
      data: booking,
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message })
  }
}

// Api to change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user
    const { bookingId, status } = req.body
    const booking = await Booking.findById(bookingId)
    if (booking.owner.toString() !== _id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to change this booking status',
      })
    }

    // if (!booking) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Booking not found',
    //   })
    // }
    booking.status = status
    await booking.save()
    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message })
  }
}

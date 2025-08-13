import mongoose from 'mongoose'
const connectDb = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database connected'))
    await mongoose.connect(`${process.env.MONGODB_URI}/car-RentalDB`)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
export default connectDb

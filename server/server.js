import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDb from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import ownerRouter from './routes/ownerRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'
import googleAuthRouter from './routes/googleAuthRoutes.js'
import passwordRouter from './routes/passwordRoutes.js'

// initialize express app
const app = express()

// connected to MongoDB
await connectDb()

// middleware
app.use(
  cors({
    origin: [
      'https://car-rentals-self-chi.vercel.app/', // replace with your actual Vercel frontend domain
      'http://localhost:3000', // allow local development
    ],
    credentials: true,
  })
)
app.use(express.json())

// routes
app.get('/', (req, res) => res.send('Server is Running'))
app.use('/api/user', userRouter)
app.use('/api/user', googleAuthRouter)
app.use('/api/user', passwordRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)
// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

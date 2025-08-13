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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://car-rentals-self-chi.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Added Vite default port
    ]

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
}

// Apply CORS middleware
app.use(cors(corsOptions))

// Additional headers middleware
app.use((req, res, next) => {
  // Dynamically set Access-Control-Allow-Origin based on request origin
  const allowedOrigins = [
    'https://car-rentals-self-chi.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
  ]
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  next()
})

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

export default app

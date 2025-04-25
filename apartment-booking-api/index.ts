import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDatabase from './src/utils/connect-db';
import userRoutes from './src/routes/user.routes';
import apartmentRoutes from './src/routes/apartment.routes';
import notFoundEndpoint from './src/routes/not-found-endoint.routs';

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

// ----------------- all api routes -----------------------
app.use('/api/users', userRoutes)
app.use('/api/apartments', apartmentRoutes)
app.get('/', (req, res) => {
  res.send('Hello from Express + Prisma + TypeScript!')
})

// ----------------- notfound api routes ------------------
app.use('/', notFoundEndpoint);


const PORT = process.env.API_PORT || 8000
app.listen(PORT, async () => {
  await connectToDatabase()
  console.log(`Server is running on http://localhost:${PORT}`)
})

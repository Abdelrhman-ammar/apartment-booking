import express from 'express'
import dotenv from 'dotenv';
import connectToDatabase from './src/utils/connect-db';
import userRoutes from './src/routes/user.routes';

dotenv.config()
const app = express()
app.use(express.json())
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello from Express + Prisma + TypeScript!')
})

const PORT = process.env.API_PORT || 8000
app.listen(PORT, async () => {
  await connectToDatabase()
  console.log(`Server is running on http://localhost:${PORT}`)
})

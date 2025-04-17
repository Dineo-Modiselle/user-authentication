import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from '../server/config/mongoDB.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRoutes.js'; 


dotenv.config();

const app = express();

// Set up the server
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true,
  origin: "http://localhost:5173",}));

//api endpoints 
app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}   );

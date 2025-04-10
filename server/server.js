import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from '../server/config/mongoDB.js';
import authRouter from '../server/routes/authRouter.js'; 

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true,}));
//api endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
    });
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}   );

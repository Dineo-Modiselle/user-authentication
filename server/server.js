import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from '../server/config/mongoDB.js'; 


const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true,}));

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}   );

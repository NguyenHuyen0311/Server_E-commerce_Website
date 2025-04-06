import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDatabase.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';

const app = express();
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

app.get("/", (request, response) => {
    // server to client
    response.json({
        message: "Server is running " + process.env.PORT
    })
})

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running",  process.env.PORT);
    })
})
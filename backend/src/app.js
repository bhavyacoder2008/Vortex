import cookieParser from 'cookie-parser';
import express from 'express';
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.routes.js"
import cors from "cors"


const app = express();

app.use(cors({
    origin : "https://vortex-blue-eight.vercel.app",
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/users" , userRouter)
app.use("/post" , postRouter)



export default app;
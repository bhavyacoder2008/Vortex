import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"

dotenv.config();

connectDB()
console.log()



app.listen(3000,()=> {
    console.log("Server started ....")
})
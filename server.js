import express from "express";
// const express = require("express");
import cors from "cors";
import {connectDB} from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import dotenv from 'dotenv';
import cartRouter from "./routes/cartRoute.js";
import auth from "./middleware/auth.js";
dotenv.config();
const app = express();
import orderRouter from "./routes/orderRoute.js";


app.use(express.json());
app.use(cors());


// router for food 

app.use("/api/food",foodRouter)
app.use("/images",express.static("uploads"))
app.use("/api/user",userRouter)
app.use("/api/cart/",auth, cartRouter)
app.use("/api/order/", orderRouter)



app.get("/",(req,res)=>{    
    res.send(connectDB())
})
const port =5001 || process.env.PORT;
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
    
});


import express from "express"
import {createCart ,removeFromCart ,getCart} from "../controller/cartController.js"
const cartRouter = express.Router()
import auth from "../middleware/auth.js"

cartRouter.post("/createCart", auth , createCart)

cartRouter.post("/removeFromCart", auth , removeFromCart)

cartRouter.get("/getCart", auth , getCart)


export default cartRouter
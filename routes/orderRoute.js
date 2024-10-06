import express from "express";
import { getAllOrders, placeOrder , userOrders, verifyOrder ,updateStatus} from "../controller/orderController.js";

import auth from "../middleware/auth.js";



const orderRouter = express.Router();

orderRouter.post("/place",auth, placeOrder);
orderRouter.post("/verify",auth, verifyOrder);
orderRouter.get("/user-orders",auth , userOrders)
orderRouter.get("/get-all-order" ,getAllOrders)
orderRouter.post("/update-status",updateStatus)

export default orderRouter
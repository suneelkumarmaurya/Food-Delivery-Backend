import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const placeOrder = async (req, res) => {
    const { userId, items, amount, address } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                message: "User not found",
                success: false,
                error: true,
            });
        }
        const order = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
        });
        const savedOrder = await order.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${order._id}`,
        })
        res.json({
            success: true,
            session_url: session.url
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong",
            error: error
        })
    }
}

const verifyOrder = async (req, res) => {
    const { success, orderId } = req.body;
    if (success === "true") {
        const order = await orderModel.findByIdAndUpdate(orderId, {
            payment: true
        });
        res.json({
            success: true,
            message: "Order paid successfully",
            error: false
        })
    } else {
        const order= await orderModel.findByIdAndDelete(orderId)
        res.json({
            success: false,
            message: "Payment failed",
            error: true
        })
    }
}

const userOrders = async(req,res)=>{
    try{
        const {userId}=req.body
        const orders=await orderModel.find({userId})
        res.json({
            success:true,
            order:orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong",
            error: error
        })
    }
   
}

const getAllOrders = async(req,res)=>{
    try{
        const orders=await orderModel.find()
        res.json({
            success:true,
            order:orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Something went wrong",
            error: error
        })
    }
   
}

const updateStatus = async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({
            success:true,
            message:"Order status updated successfully",
            error:false
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
            error: true
        })
    }
}


export { placeOrder, verifyOrder , userOrders ,getAllOrders ,updateStatus}
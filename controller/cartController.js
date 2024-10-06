import userModel from "../models/userModel.js";


const createCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body
        const userData = await userModel.findById({ _id: userId })
        const userCartData = userData.cartData
        if (!userData) {
            res.json({
                message: "user not found",
                success: false,
                error: true
            })
        }
        if (!userCartData[itemId]) {
            userCartData[itemId] = 1
        } else {
            userCartData[itemId] += 1
        }
        const updatedData = await userModel.findByIdAndUpdate({ _id: userId }, { $set: { cartData: userCartData } })
        res.json({
            message: "success",
            data: updatedData,
            success: true,
            error: false
        })
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
            error: true
        })
    }

}

const removeFromCart = async (req, res) => {
    const { userId, itemId } = req.body
    const userData = await userModel.findById({ _id: userId })
    const userCartData = userData.cartData

    if (!userCartData[itemId]) {
        res.json({
            message: "product not found in cart",
            success: false,
            error: true
        })
    }
    if (userCartData[itemId] === 1) {
        delete userCartData[itemId]
    } else {
        userCartData[itemId] -= 1
    }
    const updatedData = await userModel.findByIdAndUpdate({ _id: userId }, { $set: { cartData: userCartData } })
    res.json({
        message: "success",
        data: updatedData,
        success: true,
        error: false
    })
}

const getCart = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById({ _id: userId })
        const userCartData = userData.cartData
        res.json({
            message: "success",
            data: userCartData,
            success: true,
            error: false
        })
    } catch (error) {
        console.log(error)
    }
}

export { createCart, removeFromCart, getCart }
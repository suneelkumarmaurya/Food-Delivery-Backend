import usermodel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await usermodel.findOne({ email })
        if (!userExist) {
            return res.json({
                message: "User not found",
                success: false,
                error: true
            })
        }
        const isMatch = await bcrypt.compare(password, userExist.password)
        if (!isMatch) {
            return res.json({
                message: "Invalid crediential",
                success: false,
                error: true
            })
        }
        const token = createJWTToken(userExist._id)
        res.json({
            success: true,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Something went wrong",
            success: false,
            error: true
        })
    }
}


const createJWTToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_key ,{
        expiresIn: "2h"
    });
}
const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const userExist = await usermodel.findOne({ email })
        if (userExist) {
            return res.json({
                message: "User already exist",
                success: false,
                error: true
            })
        }
        const validateEmail = validator.isEmail(email)
        if (!validateEmail) {
            return res.json({
                message: "Please enter valid email",
                success: false,
                error: true
            })
        }
        if (password.length < 5) {
            return res.json({
                message: "Please enter strong password",
                success: false,
                error: true
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new usermodel({
            name: name,
            email: email,
            password: hashedPassword,

        })
        const saveUser = newUser.save();
        const token = createJWTToken(saveUser._id)

        res.json({
            success: true,
            token
        })
    } catch (err) {
        console.log(err)
    }

}

export { login, registerUser }
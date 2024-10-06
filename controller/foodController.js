import foodModel from "../models/foodModel.js";
import fs from "fs";
const addFood = async (req, res) => {
    const fileName = req.file.filename;
    const newFood = new foodModel({
        name: req.body.name,
        image: fileName,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
    })

    try {
        const food = await newFood.save()

        res.status(201).json({
            message: "Food added successfully",
            data: food,
            success: true,
            error: false
        })
    } catch (error) {
        res.status(409).json({
            message: error.message,
            success: false,
            error: true,
            data: []
        })
    }
}

const listFood = async (req, res) => {
    try {
        const food = await foodModel.find({});
        res.status(200).json({
            message: "All food list",
            data: food,
            success: true,
            error: false
        })
    } catch (error) {
        res.status(409).json({
            message: error.message,
            success: false,
            error: true,
            data: []
        })
    }
}


const removeFood = async (req, res) => {
    try {
        const deleteFood = await foodModel.findById(req.body.id);
        if (deleteFood) {
            fs.unlink(`uploads/${deleteFood.image}`, (err) => { })
        } else {
            res.send({
                message: "Food not found",
                success: false,
                error: true,
                data: []
            })
        }
        const food = await foodModel.findByIdAndDelete(req.body.id);
        if (food) {
            res.send({
                message: "Food deleted successfully",
                data: food,
                success: true,
                error: false
            })
        } else {
            res.send({
                message: "Food not found",
                success: false,
                error: true,
                data: []
            })
        }
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            error: true,
            data: []
        })
    }
}

export { addFood, listFood, removeFood }

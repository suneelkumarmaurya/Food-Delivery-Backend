import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-del',{

        });
    } catch (error) {
        console.log(`error: ${error}`);
    }
};

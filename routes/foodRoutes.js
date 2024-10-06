import express from "express"
import {addFood ,listFood ,removeFood} from "../controller/foodController.js"
const foodRouter = express.Router()
import multer from "multer"

// storage of image

const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){

        cb(null,`${Date.now()}${file.originalname}`)
    }
})
const uploads=multer({storage:storage})

foodRouter.post("/addFood",uploads.single("image"),addFood)

// list food 
foodRouter.get("/listFood",listFood)
// delete food
foodRouter.post("/removeFood",removeFood)


export default foodRouter
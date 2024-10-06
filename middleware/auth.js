import jwt from "jsonwebtoken"

 const auth = async(req, res, next) => {

    try {
        const token = req.headers.token
        if (!token) {
            return res.json({
                success: false,
                message: "Please login first"
            })
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.body.userId = decoded.id
            next()
        }
    } catch (error) {
        res.json({
            success: false,
            message: error
        })
    }
}
export default auth
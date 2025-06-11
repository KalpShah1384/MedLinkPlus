import jwt from "jsonwebtoken";
const authAdmin = (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
            return res.json({success:false,message:"Not Authorized"});
        } 
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success:false,message:"Not Authorized"});
        }
        next();

    } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
    }
}
export default authAdmin;
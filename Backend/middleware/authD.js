import jwt from "jsonwebtoken";

const authD = (req, res, next) => {
    const token = req.headers.dtoken;
    if (!token) return res.status(401).json({ success: false, message: "No token, authorization denied" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};

export default authD;

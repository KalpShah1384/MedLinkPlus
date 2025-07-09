import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    let token = req.headers.token;
    // Also support 'Authorization: Bearer <token>'
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized: No token provided",
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decodedToken.id,
      email: decodedToken.email || null,
    };
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;

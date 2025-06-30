import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized: No token provided",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Preferred approach: store authenticated user info in req.user
    req.user = {
      id: decodedToken.id,
      email: decodedToken.email || null, // optional if token contains email
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

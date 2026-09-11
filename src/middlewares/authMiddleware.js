import jwt from "jsonwebtoken";

// Middleware để xác thực token
export const authMiddleware = (req, res, next) => {
    // Lay authorization header từ request header
    const authHeader = req.headers.authorization;

    // Kiểm tra xem header có tồn tại 
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    // Tách Bearer scheme và token từ Authorization header
    const token = authHeader.split(" ")[1];

    // Kiểm tra xem token có tồn tại
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    // Xác thực token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    

    
    next();

    
    

    
}
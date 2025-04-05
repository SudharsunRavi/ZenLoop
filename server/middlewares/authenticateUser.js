import jwt from 'jsonwebtoken';

const authenticateUser = async (req,res,next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ status: false, message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        res.status(403).json({ status: false, message: "Invalid token" });
    }
}

export default authenticateUser
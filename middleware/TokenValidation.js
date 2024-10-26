import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserService from "../services/UserService.js";
dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      } else {
        return res.status(403).json({ message: "Invalid token" });
      }
    }
    req.user = user;
    next();
  });
};

// middleware/authMiddleware.js
export const verifySuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing." });
    }

    const isSuperAdmin = await UserService.isSuperAdminUser(req.body.userKey);
    if (isSuperAdmin) {
      next();
    }
  } catch (error) {
    res.status(403).json({ message: "Access denied. Super admin only." });
  }
};

// middleware/authMiddleware.js
export const verifyStreamerOrSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing." });
    }

    const isSuperAdmin = await UserService.isSuperAdminUser(req.body.userKey);
    if (isSuperAdmin) {
      next();
    }
  } catch (error) {
    res.status(403).json({ message: "Access denied. Super admin only." });
  }
};

export default authenticateToken;

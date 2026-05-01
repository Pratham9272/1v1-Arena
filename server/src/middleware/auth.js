import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const requireAdminAccessKey = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];
  const expectedAdminKey = process.env.ADMIN_ACCESS_KEY || "admin123";

  if (!adminKey || adminKey !== expectedAdminKey) {
    return res.status(403).json({ message: "Admin access denied." });
  }

  next();
};

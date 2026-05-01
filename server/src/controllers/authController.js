import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { createToken } from "../utils/token.js";

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  walletBalance: user.walletBalance,
  role: user.role,
  bonusGranted: user.bonusGranted,
  walletTransactions: user.walletTransactions,
  createdAt: user.createdAt
});

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All signup fields are required." });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    passwordHash
  });

  const token = createToken({ userId: user._id, role: user.role });

  res.status(201).json({
    token,
    user: sanitizeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = createToken({ userId: user._id, role: user.role });

  res.json({
    token,
    user: sanitizeUser(user)
  });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

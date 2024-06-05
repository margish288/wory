import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { validateEmail, validatePassword, validateRole } from "../validator";

export const signup = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isRoleValid = validateRole(role);

    if (!isEmailValid) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!isPasswordValid) {
      return res.status(400).json({
        error:
          "Password must be between 6 and 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter",
      });
    }

    if (!isRoleValid) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (e) {
    res.status(500).json({ error: "Error logging in" });
  }
};

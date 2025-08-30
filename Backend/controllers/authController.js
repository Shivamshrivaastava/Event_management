const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: "Email already in use" });

        const user = await User.create({ name, email, password, role });
        const token = signToken(user);
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message || "Signup failed" });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        const token = signToken(user);
        res.json({ user: user.toJSON(), token });
    } catch (err) {
        res.status(500).json({ message: err.message || "Login failed" });
    }
};

module.exports = { login, signup }
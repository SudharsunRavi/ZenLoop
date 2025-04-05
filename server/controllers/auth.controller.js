// const { createAvatar } = require('@dicebear/core');
// const { shapes } = require('@dicebear/collection');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require('../models/user.module');

// const shape = ["Valentina", "Brian", "Wyatt", "Jocelyn", "Sophia"];
// const randomSeed = shape[Math.floor(Math.random() * shape.length)];

// const avatar = createAvatar(shapes, {
//     "seed": randomSeed
// });
// const svg = avatar.toString();

const signup = async (req, res) => {
    try {
        const { username, password, walletAddress } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error("Username already exists");

        if (walletAddress) {
            const existingWallet = await User.findOne({ walletAddress });
            if (existingWallet) throw new Error("Wallet address already linked to another account");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            avatar: "abc",
            walletAddress: walletAddress || null
        });

        await newUser.save();
        res.status(201).json({ status: true, message: "Sign up successfully, Login to continue!" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { username, password: inputPassword } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) throw new Error("Invalid credentials");

        const verifyPassword = await bcrypt.compare(inputPassword, existingUser.password);
        if (!verifyPassword) throw new Error("Invalid credentials");

        const { password, ...userInfo } = existingUser.toObject();
        //const token = jwt.sign({ token: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1d
            // secure:false
        });
        res.status(200).json({ status: true, data: userInfo });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


module.exports={signup,login}
const User = require('../models/userSchema');
const generateToken = require('../utils/jwtToken');
const cloudinary = require('cloudinary').v2; 
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const userDetails = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dob, role, password, gender } = req.body;

        if (!firstName || !lastName || !email || !phone || !dob || !gender || !role || !password) {
            return res.status(400).json({ error: "Please fill all the fields." });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already registered" });
        }

        user = await User.create({ firstName, lastName, email, phone, dob, role, password, gender });
        generateToken(user, "User created successfully", 201, res);
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong." });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { email, password, confirmPassword, role } = req.body;

        if (!email || !password || !confirmPassword || !role) {
            return res.status(400).json({ error: "Please fill all the required fields." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        let user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        if (role !== user.role) {
            return res.status(400).json({ error: "User not found with this role" });
        }

        generateToken(user, "Login successful", 200, res);
    } catch (error) {
        console.error("Error logging in user:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong." });
    }
};

// Create a new admin
const adminDetails = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dob, password, gender } = req.body;

        if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
            return res.status(400).json({ error: "Please fill all the fields." });
        }

        let isRegistered = await User.findOne({ email });
        if (isRegistered) {
            return res.status(400).json({ error: `${isRegistered.role} already registered` });
        }

        const admin = await User.create({
            firstName, lastName, email, phone, dob, role: "admin", password, gender
        });
        generateToken(admin, "Admin created successfully", 201, res);
    } catch (error) {
        console.error("Error creating admin:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong." });
    }
};

// Get all doctors
const getAllDoctor = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" });
        res.status(200).json({
            success: true,
            doctors
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Get current user
const getUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Admin logout
const adminLogout = async (req, res) => {
    try {
        res.status(200).cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now())
        }).json({
            success: true,
            message: "Admin logged out successfully!",
        });
    } catch (error) {
        console.error("Error logging out admin:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
};

// User logout
const userLogout = async (req, res) => {
    try {
        res.status(200).cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: "User logged out successfully!",
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
};

// Create a new doctor
const doctorDetails = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) { 
            return res.status(400).json({ error: "docAvatar required" });
        }

        const { docAvatar } = req.files;
        const allowedFormats = ['image/png', 'image/jpg', 'image/webp'];
        if (!allowedFormats.includes(docAvatar.mimetype)) {
            return res.status(400).json({ error: "File format not supported" });
        }

        const { firstName, lastName, email, phone, dob, password, gender, doctorDepartment } = req.body;
        if (!firstName || !lastName || !email || !phone || !dob || !gender || !password || !doctorDepartment) {
            return res.status(400).json({ error: "Please fill all the fields." });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already registered" });
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath); 
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary error", cloudinaryResponse.error);
            return res.status(400).json({ error: "Cloudinary error" });
        }

        user = await User.create({
            firstName, lastName, email, phone, dob, role: "doctor", password, gender, doctorDepartment, docAvatar: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url, 
            }
        });
        res.status(200).json({message:"Doctor registered successfully"})
    } catch (error) {
        console.error("Error creating doctor:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
}

module.exports = {
    userDetails,
    login,
    adminDetails,
    getAllDoctor,
    getUser,
    adminLogout,
    userLogout,
    doctorDetails
};

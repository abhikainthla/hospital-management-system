const User = require('../models/userSchema');
const generateToken = require('../utils/jwtToken');

// Create a new user
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
        console.log("error"+error)
        res.status(404).json({ error: "Something went wrong" });
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
        console.log("error"+error)
        res.status(404).json({ error: "Something went wrong" });
    }
};

const adminLogout = async (req, res)=>{
    try {
        res.status(200).cookie("adminToken", "",{
            httpOnly:true,
            expires: new Date(Date.now())
        }

        ).json({
            "success":true,
            "message":"Admin logged out successfully!",
        })
    }
    catch(error){
        console.log("error"+error)
        res.status(404).json({error: "Something went wrong!"})
    }
};

const userLogout = async (req, res)=>{
    try {
        res.status(200).cookie("patientToken", "",{
            httpOnly: true,
            expires: new Date(Date.now()),
        }).json({
            "success":true,
            "message":"User logged out successfully!",
        })
    }
    catch(error){
        console.log("error"+error)
        res.status(404).json({error: "Something went wrong!"})
    }
};

module.exports = {
    userDetails,
    login,
    adminDetails,
    getAllDoctor,
    getUser,
    adminLogout,
    userLogout
};

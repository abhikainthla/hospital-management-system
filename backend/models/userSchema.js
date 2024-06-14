const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        minLength: [3, "First Name must contain at least 3 characters!"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        minLength: [3, "Last Name must contain at least 3 characters!"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email!"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        maxLength: [10, "Phone must contain 10 characters!"],
        validate: [validator.isMobilePhone, "Please provide a valid number!"]
    },
    dob: {
        type: Date,
        required: [true, "DOB is required"],
    },
    gender: {
        type: String,
        required: [true, "Please Specify your gender"],
        enum: ['male', 'female', 'other']
    },
    password: {
        type: String,
        minLength: [11, "Password must contain 11 characters"],
        required: [true, "Password is required"],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'doctor'],
        default: 'user',
        required: true
    },
    doctorDepartment: {
        type: String,
        required: function() {
            return this.role === 'doctor';
        }
    },
    docAvatar: {
        public_id: String,
        url: String,
    },
});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateJsonWebToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

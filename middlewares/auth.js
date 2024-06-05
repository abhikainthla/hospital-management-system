const User = require('../models/userSchema');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');

const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.status(401).json({ error: "Admin not authenticated!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: `${req.user?.role || 'User'} not authorized for this resource!` });
    }

    next();
});

const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return res.status(401).json({ error: "User not authenticated!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user || req.user.role !== "user") {
        return res.status(403).json({ error: `${req.user?.role || 'User'} not authorized for this resource!` });
    }

    next();
});

module.exports = {
    isAdminAuthenticated,
    isUserAuthenticated
};

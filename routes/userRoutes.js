const express = require('express');
const {
    userDetails,
    login,
    adminDetails,
    getAllDoctor,
    getUser,
    adminLogout,
    userLogout
} = require('../controller/userController');
const {
    isAdminAuthenticated,
    isUserAuthenticated
} = require('../middlewares/auth');

const router = express.Router();

// User routes
router.post('/user', userDetails);
router.post('/user/login', login);
router.get('/user/me', isUserAuthenticated, getUser);
router.get('/user-logout', isUserAuthenticated, userLogout)


// Admin routes
router.post('/admin', isAdminAuthenticated, adminDetails);
router.get('/admin/me', isAdminAuthenticated, getUser);
router.get('/admin-logout', isAdminAuthenticated, adminLogout)

// Doctor routes
router.get('/doctors', getAllDoctor);

module.exports = router;

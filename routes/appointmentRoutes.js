const express = require('express');
const createAppointment = require('../controller/appointmentController');
const { isUserAuthenticated } = require('../middlewares/auth');
const router = express.Router()

router.post('/create-appointment', isUserAuthenticated, createAppointment);

module.exports = router
const express = require('express');
const {createAppointment, getAppointments, updateAppointmentStatus, deleteAppointment} = require('../controller/appointmentController');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middlewares/auth');
const router = express.Router()

router.post('/create-appointment', isUserAuthenticated, createAppointment);
router.get('/getAppointments', isAdminAuthenticated, getAppointments)
router.put('/update/:id', isAdminAuthenticated, updateAppointmentStatus)
router.delete('/delete/:id', isAdminAuthenticated, deleteAppointment);
module.exports = router
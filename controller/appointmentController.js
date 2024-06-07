const Appointment = require("../models/appointmentSchema");
const User = require("../models/userSchema");

const createAppointment = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            dob,
            address,
            appointmentDate,
            hasVisited,
            department,
            doctor_firstName,
            doctor_lastName
        } = req.body;

        if (!firstName || !lastName || !email || !phone || !gender || !dob || !address || !appointmentDate || !department || !doctor_firstName || !doctor_lastName) {
            return res.status(400).json({ error: "Please fill all the required fields" });
        }

        const doctor = await User.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "doctor",
            doctorDepartment: department
        });

        if (doctor.length === 0) {
            return res.status(404).json({ error: "Couldn't find any doctor with such credentials" });
        }
        if (doctor.length > 1){
            return res.status(404).json({ error: "Doctor conflict! Pleaser contact through emmail or phone" });
        }

        const doctor_id = doctor[0]._id;
        const patient_id = req.user._id;

        const appointment = await Appointment.create({
            firstName,
            lastName,
            email,
            phone,
            gender,
            dob,
            address,
            appointmentDate,
            hasVisited,
            department,
            doctor: { firstName: doctor_firstName, lastName: doctor_lastName },
            doctor_id,
            patient_id
        });

        res.status(201).json({ success: true, message: "Appointment created successfully" });
    } catch (error) {
        console.error("Error creating appointment", error);
        return res.status(500).json({ error: "Error creating appointment" });
    }
};

module.exports = createAppointment;

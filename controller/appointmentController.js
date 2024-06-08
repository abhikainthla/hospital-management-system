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

const getAppointments = async(req,res)=>{
    try{
        const appointments = await Appointment.find();
        res.status(200).json({success:true, appointments});
    }
    catch(error){
        console.log("Error occured while fecthing appointments", error);
        res.status(400).json({success:false, error:"Error occured while fecthing appointments"});
    }
}

const updateAppointmentStatus = async(req, res)=>{
    try{
    const {id} = req.params;
    let appointment = await Appointment.find();
    if(!appointment){
        return res.status(404).json({error:"Couldn't find any appointment"})
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new : true ,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success:true,
        message:"Appointment Status Updated",
        appointment
    })
}
    catch(error){
        console.log("Something wetn wrong", error);
        res.status(400).json({error:"Something went wrong"})
    }

}

const deleteAppointment = async(req, res)=>{
    try{
        const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return res.status(404).json({error:"Couldn't find any appointment"})
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment deleted successfully",
        appointment
    })
    }
    catch(error){
        console.log("Something wetn wrong", error);
        res.status(400).json({error:"Something went wrong"})
    }
}

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointmentStatus,
    deleteAppointment
};

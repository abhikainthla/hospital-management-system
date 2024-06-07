const mongoose = require('mongoose');
const validator = require('validator');


const appointmentSchema = new mongoose.Schema({
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
    appointmentDate:{
        type: String,
        required: true
    }, 
    department:{
        type: String,
        required: true 
    },
    doctor:{
        firstName:{
            type: String,
            required: true 
        },
        lastName:{
            type: String,
            required: true 
        }
    },
        hasVisited:{
            type: Boolean,
            default: false
        },
        doctor_id:{
            type: mongoose.Schema.ObjectId,
            required: true
        },
        patient_id:{
            type: mongoose.Schema.ObjectId,
            required: true
        },
        address:{
            type:String,
            required: true
        },
        status:{
            type:String,
            enum: ["Pending", "Accepted", "Declined"],
            default: "Pending"
        }

});

const Appointment = mongoose.model('Appointment', appointmentSchema);


module.exports = Appointment;

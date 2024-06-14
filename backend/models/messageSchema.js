const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema({
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
        validate: [validator.isEmail, "Please provide a valid email!"]
    },
    phone:{
        type: String,
        required: [true, "Phone is required"],
        maxLength: [10, "Phone must contain 10 characters!"],
        validate: [validator.isMobilePhone, "Please provide a valid number!"]
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        minLength: [10, "Message must contain at least 10 characters!"]
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

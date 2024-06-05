const Message = require('../models/messageSchema');
const catchAsyncError = require('../middlewares/catchAsyncErrors')
const sendMessage = catchAsyncError(async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({ error: "Please fill all the fields." });
        }

        console.log(req.body);

        await Message.create({
            firstName, lastName, email, phone, message
        });

        return res.status(200).json({
            message: "Details sent successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "An error occurred while sending the message."
        });
    }
});

module.exports = sendMessage;

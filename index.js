const express = require('express');
const mongoose = require('mongoose');
const cloudnary = require('cloudinary');
const messageRoutes = require('./routes/messageRoutes')
require('dotenv').config();
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials:true,
    })
)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/",
    })
)

    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Error connecting to database: " + err);
    });

    cloudnary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    app.use(messageRoutes);

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Failed to start server: ${err}`);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});

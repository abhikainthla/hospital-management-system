const express = require('express');
const {sendMessage, getAllMessages} = require('../controller/messageController');
const { isAdminAuthenticated } = require('../middlewares/auth');

const router = express.Router();
router.post('/message', sendMessage);
router.get('/getAll',isAdminAuthenticated, getAllMessages)
module.exports = router;
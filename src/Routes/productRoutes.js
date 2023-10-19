const express = require('express');
const router = express.Router();
const userAuth = require('../Middleware/userAuth');
const adminAuth = require('../Middleware/adminAuth');
const cookieParser = require("cookie-parser");
router.use(cookieParser());




module.exports = router;

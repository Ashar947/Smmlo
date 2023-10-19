const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userAuth = require('../Middleware/userAuth');
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const { createNew, login, currentUser, logoutUser, resetPassword, userUpadte } = require('../Controller/userController');

router.route('/register').post(createNew);
router.route('/login').post(login);
router.route('/about').get(userAuth, currentUser);
router.route('/logout').get(userAuth, logoutUser);
router.route('/resetpassword').put(userAuth, resetPassword);
router.route('/updateUser').get(userAuth, userUpadte);


module.exports = router ;
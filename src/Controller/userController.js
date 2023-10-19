const { json } = require("express");
const User = require('../Models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
// var validator = require("email-validator");
const {throw_error} = require('../Controller/custom');



const createNew = async (req, res) => {
    try {
        
        const { fullName, email, phone, password } = req.body;
        if (fullName.length == 0 || phone.length == 0 || email.length == 0 || password.length == 0) {
            throw_error("Fields cannot be left empty");
        }
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            throw_error("User already registered");
        }
        const createUser = new User({ fullName, email, domain: "self", phone, password });
        await createUser.save();
        console.log("User Created");
        return res.status(200).json({ message: "User Created", User: createUser })
    } catch (error) {
        res.status(404).json({ msg: "Error", message: error.message })
    }
}; // Working

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            throw_error("User Not Found . Please Register");
        }
        const passMatch = await bcrypt.compare(password, checkUser.password);
        if (passMatch) {
            const token = await checkUser.generateAuthToken();
            res.cookie("jwtoken", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Expires in 3 days
            });
            // res.cookie("jwtoken", token, {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'None',
            //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            // });
            res.status(200).json({ message: "User Logged In" });
        } else {
            throw_error("Password Incorrect");
        }
    } catch (error) {
        return res.status(404).json({ msg: "Error", message: error.message })
    }
}; // Working

const currentUser = async (req, res) => {
    try {
        const getUser = req.rootUser;
        res.status(200).json({ status: true, message: "Current User", user: getUser, orderDetails: getUser.payment_details });
    } catch (error) {
        console.log(`Error is ${error}`)
        return res.status(404).json({ status: false, message: "Error" })
    }
}; // Working

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwtoken", { path: "/" });
        return res.status(200).json({ message: "User Logged Out" });
    } catch (error) {
        return res.status(404).json({ catch: true, message: error });
    }
}; // Working

const resetPassword = async (req, res) => {
    try {
        const user = req.rootUser;
        const { oldPassword, newPassword, confrimPassword } = req.body;
        if (oldPassword.length == 0 || newPassword.length == 0 || confrimPassword.length == 0) {
            throw_error("Fields cannot be left blank");
        }
        if (newPassword != confrimPassword) {
            throw_error("Password doesnot match");
        };
        const checkUser = await User.findOne({ _id: user._id });
        if (!checkUser) {
            throw_error("User Not Found");
        };
        const isPasswordMatched = await checkUser.comparePassword(oldPassword);
        if (!isPasswordMatched) {
            throw_error("Invalid Password");
        };
        const newPassHash = await bcrypt.hash(newPassword, 12);
        const update = await User.updateOne({ _id: user._id },
            {
                $set: { password: newPassHash },
            }
        );
        res.clearCookie("jwtoken", { path: "/" });
        return res.status(200).json({ status: true, message: "Password Updated . Please Login Again With New Password" });
    } catch (error) {
        return res.status(404).json({message: error.message });
    }
}; // Working

const userUpadte = async (req, res) => {
    try {
        const user = req.rootUser;
        const { fullName, email, phone, type } = req.body;
        const getUser = await User.updateOne({ _id: user._id },
            {
                $set: {
                    fullName: fullName,
                    phone: phone,
                }
            });
        return res.status(200).json({ status: true, message: "User Updated", user: getUser })
    } catch (error) {
        return res.status(404).json({ catch: true, errormsg: error, message: "User cannot be updated at the moment. Please try again later ." })
    }
}; // Working



module.exports = { createNew,login,currentUser,logoutUser,resetPassword,userUpadte };
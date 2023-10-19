const { json } = require("express");
const Admin = require("../Models/adminModel");
const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { throw_error } = require("./custom");




const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (fullName.length == 0 || email.length == 0 || password.length == 0) {
      throw_error("Fields cannot be left empty");
    }
    const checkAdmin = await Admin.findOne({ email: email });
    if (checkAdmin) {
      throw_error("Admin already registered with this email");
    }
    const createAdmin = new Admin({ fullName, email, password });
    await createAdmin.save();
    return res.status(200).json({ message: "Admin Created", Admin: createAdmin });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}; // Working

const loginadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length == 0 || password.length == 0) {
      throw_error("Fields Cannot Be Left Blank");
    }
    const checkUser = await Admin.findOne({ email: email });
    const old = checkUser.password;
    if (!checkUser) {
      throw_error("Admin Not Found . Please Register");
    }
    const passMatch = await bcrypt.compare(password, old);
    if (passMatch) {
      const token = await checkUser.generateAuthToken();
      res.cookie("jwtoken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
      res.status(200).json({ message: "Admin Logged In" });
    } else {
      throw_error("Password Incorrect");
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "Error", message: error.message });
  }
}; // Working

const currentAdmin = async (req, res) => {
  try {
    const admin = req.rootUser;
    res.status(200).json({ message: "Admin is Logged In", admin: admin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; // Working

const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("jwtoken", { path: "/" });
    return res.status(200).json({ msg: "Admin Logged Out" });
  } catch (error) {
    return res.status(404).json({ catch: true, errormsg: error });
  }
}; // Working

const resetPassword = async (req, res) => {
  try {
    const admin = req.rootUser;
    const { oldPassword, newPassword, confrimPassword } = req.body;
    if (oldPassword.length == 0 || newPassword.length == 0 || confrimPassword.length == 0
    ) {
      throw_error("Fields cannot be left blank");
    }
    if (newPassword != confrimPassword) {
      throw_error("Password doesnot match");
    }
    const isPasswordMatched = await bcrypt.compare(`${oldPassword}`, `${admin.password}`);
    console.log(`isPasswordMatched == ${isPasswordMatched}`);
    if (!isPasswordMatched) {
      throw_error("Invalid Password");
    }
    const newPassHash = await bcrypt.hash(newPassword, 12);
    const update = await Admin.updateOne({ _id: admin._id },
      {
        $set: { password: newPassHash },
      }
    );
    return res.status(200).json({ status: true, message: "Admin Password Updated", update: update });
  } catch (error) {
    return res.status(404).json({ catch: true, message: error.message });
  }
}; // Working

const adminUpadte = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const admin = req.rootUser;
    const updateAdmin = await Admin.findOne({ _id: admin._id }, {
      $set: {
        fullName: fullName,
        phone: phone,
      },
    }
    );
    return res.status(200).json({ status: true, message: "Admin Updated", admin: updateAdmin });
  } catch (error) {
    res.status(404).json({ msg: "something went wrong", error: error });
  }
}; // Working

const getallUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users: users });
  } catch (error) {
    res.status(404).json({
      message: "Something Went Wrong While Accessing Users",
      error: error,
    });
  }
}; // Working

const deleteUserByID = async (req, res) => {
  try {
    const delUser = await User.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: "User Deleted " });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}; // Working






module.exports = { register, loginadmin, currentAdmin, logoutAdmin, resetPassword, adminUpadte, getallUsers, deleteUserByID };

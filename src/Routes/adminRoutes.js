const express = require('express');
const router = express.Router();
const adminAuth = require('../Middleware/adminAuth');
const cookieParser = require("cookie-parser");
router.use(cookieParser());


const { register, loginadmin, currentAdmin, logoutAdmin, resetPassword, adminUpadte, getallUsers, deleteUserByID } = require('../Controller/adminController');
const { createCategory, pushProduct, deleteCategory, updateCategoryName, updateProduct, deleteProduct } = require('../Controller/admin-productController')

// Auth

router.route('/login').post(loginadmin);
router.route('/register').post(adminAuth, register);
router.route('/about').get(adminAuth, currentAdmin);
router.route('/logout').get(adminAuth, logoutAdmin);
router.route('/resetPassword').post(adminAuth, resetPassword);
router.route('/updateAdmin').post(adminAuth, adminUpadte);
router.route('/getallUsers').get(adminAuth, getallUsers);
router.route('/deleteUser/:id').delete(adminAuth, deleteUserByID);

// Product

router.route('/createCategory').post(adminAuth, createCategory)
router.route('/pushProduct/:category_id').put(adminAuth, pushProduct)
router.route('/deleteCategory/:category_id').delete(adminAuth, deleteCategory)
router.route('/updateCategoryName/:id').put(adminAuth, updateCategoryName)
router.route('/updateProduct/:category_id/:product_id').put(adminAuth, updateProduct)
router.route('/deleteProduct/:category_id/:product_id').delete(adminAuth, deleteProduct)


module.exports = router;
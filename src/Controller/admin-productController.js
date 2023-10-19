const { json } = require("express");
const Admin = require("../Models/adminModel");
const User = require("../Models/userModels");
const Product = require('../Models/productModel')
const { throw_error } = require("./custom");




const createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        if (category_name.length == 0) {
            throw_error("Fields cannot be left empty");
        }
        const createCategory = new Product({ category_name });
        await createCategory.save();
        return res.status(200).json({ message: "Category Created" });
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}; // Working

const pushProduct = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const data = await Product.findOne({ _id: category_id })
        res.status(200).json({ message: category_id, category_data: data })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
};

const deleteCategory = async (req, res) => {
    try {
        const delete_category = await Product.deleteOne({ _id: req.params.category_id });
        res.status(200).json({ message: "Category Deleted", data: delete_category });
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
};

const updateCategoryName = async (req, res) => {
    try {
        res.status(200).json({ message: "" })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
};

const updateProduct = async (req, res) => {
    try {
        res.status(200).json({ message: "" })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
};

const deleteProduct = async (req, res) => {
    try {
        res.status(200).json({ message: "" })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
};


module.exports = { createCategory, pushProduct, deleteCategory, updateCategoryName, updateProduct, deleteProduct };

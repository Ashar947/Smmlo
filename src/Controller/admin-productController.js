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
        const { product_name, price, min_order, max_order, description } = req.body;
        const category_id = req.params.category_id;
        const data = await Product.updateOne({ _id: category_id }, {
            $push: {
                products: {
                    product_name: product_name,
                    price: price,
                    min_order: min_order,
                    max_order: max_order,
                    description: description
                }
            }
        });
        res.status(200).json({ message: "Product Pushed" })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}; // Working

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
        const {category_name}=req.body;
        const product = await Product.updateOne({_id:req.params.id},{
            $set:{
                category_name:category_name
            }
        });
        return res.status(200).json({message:"Category Name Updated"});
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
};

const updateProduct = async (req, res) => {
    try {
        const { category_id, product_id , product_name, price, min_order, max_order, description } = req.body;
        const prod = await Product.findOne({ _id: category_id });
        if (!prod) {
            throw_error("Category Not Found");
        };
        const product = await prod.products.find((item)=>item._id === product_id);
        if (!product) {
            throw_error("Product Not Found");
        };
        product.product_name = product_name;
        product.price = price;
        product.min_order = min_order;
        product.max_order = max_order;
        product.description = description;
        await prod.save();
        return res.status(200).json({message:"Product Updated"})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

};

const deleteProduct = async (req, res) => {
    try {
        const { category_id, product_id } = req.body;
        // const category_id = "6530e21f4088affc046c2407";
        // const product_id = "65314f2b59b84ff7e61f6538";

        const updatedProd = await Product.findOneAndUpdate(
            { _id: category_id },
            { $pull: { products: { _id: product_id } } },
            { new: true }
        );

        if (updatedProd) {
            res.status(200).json({ message: "Products Updated" });
        } else {
            throw_error("User Not Found . Please Register");
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

};


module.exports = { createCategory, pushProduct, deleteCategory, updateCategoryName, updateProduct, deleteProduct };

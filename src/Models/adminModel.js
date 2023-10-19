const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required:true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

// hasing passowrd
adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})

// Genrating Token
adminSchema.methods.generateAuthToken = async function () {
    try {
        let genToken = jwt.sign({ _id: this._id }, process.env.SECRETKEY);
        this.tokens = this.tokens.concat({ token: genToken });
        await this.save();
        return genToken;

    } catch (error) {
        console.log(`error is ${error}`);
    }
};



module.exports = mongoose.model('Admin', adminSchema);
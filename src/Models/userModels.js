const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    domain: {
        type: String,
        enum: {
            values: ["self", "google"],
            message: `{VALUE} is not supported`
        },
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
    },
    favorite_product: [
        {
            product_id: {
                type: String
            }
        }
    ],
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
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        throw new Error('Error Creating Account');
    }
});


// Genrating Token
userSchema.methods.generateAuthToken = async function () {
    try {
        let length_tokens = this.tokens.length;
        console.log(length_tokens);
        if (length_tokens >= 10) {
            this.tokens.shift()
            await this.save();
        };
        console.log(length_tokens);
        let genToken = jwt.sign({ _id: this._id }, process.env.SECRETKEY);
        this.tokens = this.tokens.concat({ token: genToken });
        await this.save();
        return genToken;

    } catch (error) {
        console.log(`error is ${error}`);
    }
};

// Comparing Password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};




module.exports = mongoose.model('User', userSchema);
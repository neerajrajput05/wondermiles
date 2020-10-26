const mongoose = require('mongoose');
const Schema = mongoose.Schema


const user = new Schema({ 
    first_name : {
        type: String,
        trim: true,
        lowercase: true
    },
    last_name : {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
    },
    country_code: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    otp : {
        type: String,
        trim: true,
        default: 0
    },
    role: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Number
    },
    updatedAt:{
        type: Number
    }
 })

 module.exports = mongoose.model('user', user);
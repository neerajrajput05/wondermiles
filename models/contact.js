const mongoose = require('mongoose');
const Schema = mongoose.Schema


const contact = new Schema({ 
    icon: {
        type: String,
        trim: true,
        lowercase: true
    },
    name : {
        type: String,
        trim: true,
        lowercase: true
    },
    detail: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    createdById: {
        type: String
    },
    createdAt: {
        type: Number
    },
    updatedAt:{
        type: Number
    }
 })

 module.exports = mongoose.model('contact', contact);
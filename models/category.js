const mongoose = require('mongoose');
const Schema = mongoose.Schema


const category = new Schema({ 
    name : {
        type: String,
        trim: true,
        lowercase: true
    },
    description : {
        type: String,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        lowercase: true,
        trim: true
    },
    image: {
        type: String,
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

 module.exports = mongoose.model('category', category);
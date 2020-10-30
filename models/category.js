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
    image: {
        type: String,
        lowercase: true,
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
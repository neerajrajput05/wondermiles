const mongoose = require('mongoose');
const Schema = mongoose.Schema


const slider = new Schema({ 
    title : {
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

 module.exports = mongoose.model('slider', slider);
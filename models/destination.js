const mongoose = require('mongoose');
const Schema = mongoose.Schema


const destination = new Schema({ 
    name : {
        type: String,
        trim: true,
        lowercase: true
    },
    image: {
        type: String,
        trim: true
    },
    description : {
        type: String,
        trim: true,
        lowercase: true
    },
    parent: {
        type: String
    },
    type: {
        type: String,
        lowercase: true,
        trim: true
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

 module.exports = mongoose.model('destination', destination);
const mongoose = require('mongoose');
const Schema = mongoose.Schema


const social = new Schema({ 
    name : {
        type: String,
        trim: true,
        lowercase: true
    },
    link: {
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

 module.exports = mongoose.model('social', social);
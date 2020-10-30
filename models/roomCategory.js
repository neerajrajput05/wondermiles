const mongoose = require('mongoose');
const Schema = mongoose.Schema


const room_category = new Schema({ 
    title : {
        type: String,
        trim: true,
        lowercase: true
    },
    subTitle:{
        type: String,
        trim: true
    },
    description : {
        type: String,
        trim: true,
        lowercase: true
    },
    logo: {
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

 module.exports = mongoose.model('room_category', room_category);
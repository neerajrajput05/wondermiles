const mongoose = require('mongoose');
const Schema = mongoose.Schema


const hotel_term = new Schema({ 
    hotelId: {
        type: String
    },
    name : {
        type: String,
        trim: true,
        lowercase: true
    },
    images: {
        type: String,
        trim: true
    },
    type: {
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

 module.exports = mongoose.model('hotel_term', hotel_term);
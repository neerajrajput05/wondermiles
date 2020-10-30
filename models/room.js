const mongoose = require('mongoose');
const Schema = mongoose.Schema


const room = new Schema({ 
    hotelId:{
        type: String
    },
    title : {
        type: String,
        trim: true,
        lowercase: true
    },
    subTitle:{
        type: String,
        trim: true,
        lowercase: true
    },
    description : {
        type: String,
        trim: true,
        lowercase: true
    },
    video:{
        type: String
    },
    logo: {
        type: String,
    },
    basePrice: {
        type: String
    },
    discountPrice: {
        type: String

    },
    property: {
        type: String
    },
    location: {
        type: String,
        lowercase: true
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

 module.exports = mongoose.model('room', room);
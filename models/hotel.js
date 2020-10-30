const mongoose = require('mongoose');
const Schema = mongoose.Schema


const hotel = new Schema({ 
    categoryId:{
        type: String
    },
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
    video:{
        type: String
    },
    logo: {
        type: String,
        lowercase: true,
    },
    aminities: {
        type: String
    },
    rules: {
        type: String
    },
    location: {
        type: String,
        lowercase: true
    },
    callUs:{
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

 module.exports = mongoose.model('hotel', hotel);
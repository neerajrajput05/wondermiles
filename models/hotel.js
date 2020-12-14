const mongoose = require('mongoose');
const Schema = mongoose.Schema


const hotel = new Schema({ 
    categoryId:{
        type: String
    },
    code: {
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
    type: {
        type: String
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
    rules: {
        type: String
    },
    destinationId: {
        type: String
    },
    location: {
        type: String,
        lowercase: true
    },
    callUs:{
        type: String
    },
    featured: {
        type: Boolean,
        default: false
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
const mongoose = require('mongoose');
const Schema = mongoose.Schema


const aminities = new Schema({ 
    name : {
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

 module.exports = mongoose.model('aminities', aminities);
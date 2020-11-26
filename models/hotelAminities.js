const mongoose = require('mongoose');
const Schema = mongoose.Schema


const hotel_aminities = new Schema({ 
    hotelId: {
        type: String
    },
    aminitiesId : {
        type: String
    }, 
    type: {
        type: String
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

 module.exports = mongoose.model('hotel_aminities', hotel_aminities);
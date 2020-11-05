var jwt = require('jsonwebtoken');
const user = require('../../models/user');
const timeStamp = Date.now();
const validator = require('validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const config = require('../../config/database');
const path = require('path')
const roomModel = require('../../models/room')
const hotelModel = require('../../models/hotel')
const sliderModel = require('../../models/slider')


const hotelPreview = async(req, res, next) => {
    try {
        const { hotel_id } = req.body
        // if(!hotel_id) return res.status(404).json({status:false, msg: 'Please provide hotel id.'})
        const fetch_hotelview = await hotelModel.findOne({_id: hotel_id})
        if(!fetch_hotelview) return res.status(404).json({status: false, msg:'The hotel not found.'})
        return res.status(200).json({status: true, msg:'successfully getting', data: fetch_hotelview})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}





module.exports = {
    hotelPreview: hotelPreview
}
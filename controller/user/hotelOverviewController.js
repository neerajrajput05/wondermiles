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
        const fetch_hotelview = await hotelModel.findOne()
        if(!fetch_hotelview) return res.status(404).json({status: false, msg:'The hotel not found.'})
        return res.status(200).json({status: true, msg:'successfully getting', data: fetch_hotelview})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}

const resortPreview = async(req, res, next) => {
    try {
        const { resortId } = req.body
        if(!resortId) return res.status(404).json({status:false, msg: 'Please provide resort id.'})
        const fetch_resort = await hotelModel.findById({_id: resortId})
        if(!fetch_resort) return res.status(404).json({status: false, msg:'The hotel not found.'})
        return res.status(200).json({status: true, msg:'successfully getting', data: fetch_resort, aminities: JSON.parse(fetch_resort.aminities), rules: JSON.parse(fetch_resort.rules), callus: JSON.parse(fetch_resort.callUs)})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}





module.exports = {
    hotelPreview: hotelPreview,
    resortPreview: resortPreview
}
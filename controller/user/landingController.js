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


const landingRoomAccomdation = async(req, res, next) => {
    try {
        const fetch_room = await roomModel.find()
        if(!fetch_room) return res.status(404).json({status:false, msg:'The room not found.'})
        return res.json({status: true, msg:'successfully getting', data: fetch_room})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}
const landingHotelAccomdation = async(req, res, next) => {
    try {
        const fetch_hotel = await hotelModel.find()
        if(!fetch_hotel) return res.status(404).json({status:false, msg:'The hotel not found.'})
        return res.json({status: true, msg:'successfully getting', data: fetch_hotel})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}

const landingSlider = async(req, res, next) => {
    try {
        const fetch_slider = await sliderModel.find()
        if(!fetch_slider) return res.status(404).json({status:false, msg:'The slider not found.'})
        return res.json({status: true, msg:'successfully getting', data: fetch_slider})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}



module.exports = {
    landingRoomAccomdation: landingRoomAccomdation,
    landingHotelAccomdation: landingHotelAccomdation,
    landingSlider: landingSlider
}
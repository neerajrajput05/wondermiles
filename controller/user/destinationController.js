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


const destinationList = async(req, res, next) => {
    try {
        const fetch_destination = await hotelModel.find()
        if(!fetch_destination) return res.status(404).json({status:false, msg:'The destination not found.'})
        return res.json({status: true, msg:'successfully getting', data: fetch_destination})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}




module.exports = {
    destinationList: destinationList
}
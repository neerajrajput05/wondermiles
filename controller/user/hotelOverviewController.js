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
const sliderModel = require('../../models/slider');
const hotel = require('../../models/hotel');
const aminitiesModel = require('../../models/aminities')
const hotelAminitiesModel = require('../../models/hotelAminities')


const hotelPreview = async(req, res, next) => {
    try {
        const { hotelId } = req.body
        if(!hotelId) return res.status(404).json({status:false, msg: 'Please provide hotel id.'})
        const fetch_hotelview = await hotelModel.findOne({_id: hotelId})
        if(!fetch_hotelview) return res.status(404).json({status: false, msg:'The hotel not found.'})
        const fetch_hotelAminities = await hotelAminitiesModel.aggregate([
            {
                $match: { hotelId: fetch_hotelview._id }
            }
        ])
        // return res.json({data: fetch_hotelAminities})
        return res.status(200).json({status: true, msg:'successfully getting', data: fetch_hotelview, aminities: fetch_hotelAminities, rules: JSON.parse(fetch_hotelview.rules), callus: JSON.parse(fetch_hotelview.callUs)})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}


const aminitesPreview = async(req, res, next) => {
    const { aminitiesId } = req.body
    if(!aminitiesId) return res.status(404).json({status:false, msg: 'Please provide aminities id.'})
    const fetch_aminities = await aminitiesModel.findOne({_id: aminitiesId, status:true})
    if(!fetch_aminities) return res.status(404).json({status:false, msg: 'Aminities not exists.'})
    return res.status(200).json({status:true, msg:'successfully getting', data: fetch_aminities})
}

module.exports = {
    hotelPreview: hotelPreview,
    aminitesPreview: aminitesPreview
}
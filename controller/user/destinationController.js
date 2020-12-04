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
const categoryModel = require('../../models/category');
const { send } = require('process');
const { hotelList } = require('../admin/adminHotelController');


const destinationList = async(req, res, next) => {
    try {
        const { name } = req.body
        if(!name) return res.status(404).json({status:false, msg:'Please provide correct name.'})
        const fetch_subcategory = await categoryModel.aggregate([
            {
                $match: {
                    name:name.toLowerCase(), type:"sub_main", status: true
                }
            },
            {
                $addFields: { 
                    "_id" : {
                        $toString: "$_id"
                    }
                 }
            },
            {
                $lookup: {
                    from: "hotels",
                    localField: "_id",
                    foreignField: "type",
                    as: "hotelList"
                }
            }
        ])
        // return res.send(fetch_subcategory)
        if(!fetch_subcategory) return res.status(404).json({status:false, msg:'The hotel not found.'})
        return res.json({status: true, msg:'successfully getting', data: fetch_subcategory})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong.'})
    }
}





module.exports = {
    destinationList: destinationList
}
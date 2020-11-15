var jwt = require('jsonwebtoken');
const admin = require('../../models/user');
const timeStamp = Date.now();
const validator = require('validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const config = require('../../config/database');
const path = require('path')
const token_decode = require('../../logic/token_decode')
const adminCategoryModel = require('../../models/category')
const adminRoomCategoryModel = require('../../models/roomCategory')
const adminHotelModel = require('../../models/hotel')
let blob = require('based-blob');
const atob = require("atob");



const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { categoryId, title, subTitle, description, video, logo, aminities, rules, location, callUs, code} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_category = await adminCategoryModel.find({_id:categoryId})
        if(!fetch_category) return res.status(404).status(404).json({status:false, msg:'Category not exists'})
        if(!title) return res.status(404).json({ status: false, msg: 'Please provide the title.' });
        if(!subTitle) return res.status(404).json({ status: false, msg: 'Please provide the sub title.' });
        if(!description) return res.json({ status: false, msg: 'Please provide the description' });
        if(!logo) return res.json({ status: false, msg: 'Please provide the logo' });
        if(!video) return res.json({ status: false, msg: 'Please provide the video' });
        if(!aminities) return res.json({ status: false, msg: 'Please provide the aminities' });
        if(!rules) return res.json({ status: false, msg: 'Please provide the rules' });
        if(!location) return res.json({ status: false, msg: 'Please provide the location' });
        if(!callUs) return res.json({ status: false, msg: 'Please provide the callUs' });
        if(!code) return res.json({ status: false, msg: 'Please provide the code' });
        const fetch_code = await adminHotelModel.findOne({code: code})
        if(fetch_code) return res.json({ status: false, msg: 'Please provide a new code.' });
        const fetch_hotel = await adminHotelModel.findOne({title: title.toLowerCase()})
        // if(fetch_hotel) return res.json({ status: false, msg: 'The hotel already exists' });
        
        // const blob_img = new blob(logo)
        // const img = URL.createObjectURL(blob_img)
        // console.log('blob', img)
        // return res.json({data: img})
        const date = Date.now()
        var fileName =_id+(date)+".png"
        require("fs").writeFile(path.join("public/images/Hotel/"+fileName), logo, "base64", function(err) {
            console.log(err);
        });
        const URL = req.protocol+"://"+req.headers.host
        const finalImage = URL+"/images/Hotel/"+fileName;
        const addHotel = new adminHotelModel({
            categoryId: categoryId,
            title: title,
            subTitle: subTitle,
            description: description,
            video: video,
            logo: finalImage,
            aminities: JSON.stringify(aminities),
            rules: JSON.stringify(rules),
            location:location,
            code: code,
            callUs: JSON.stringify(callUs),
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addHotel.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addHotel})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


const hotelList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_hotel = await adminHotelModel.find()
        if(!fetch_hotel) return res.status(404).status(404).json({status:false, msg:'hotel not exists'})
        return res.status(200).json({status:true, msg: 'Successfully getting.', data: fetch_hotel})
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
        
    }
}


module.exports = {
    add: add,
    hotelList: hotelList
}
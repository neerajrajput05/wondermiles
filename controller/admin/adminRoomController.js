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
const adminRoomModel = require('../../models/room')


const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { hotelId, title, subTitle, description, video, logo, property, location} = req.body
        return res.json({status:true, data:req.protocol+"://"+req.headers.host})
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_hotel = await adminHotelModel.find({_id:hotelId})
        if(!fetch_hotel) return res.status(404).status(404).json({status:false, msg:'Hotel not exists'})
        if(!title) return res.status(404).json({ status: false, msg: 'Please provide the title.' });
        if(!subTitle) return res.status(404).json({ status: false, msg: 'Please provide the sub title.' });
        if(!description) return res.json({ status: false, msg: 'Please provide the description' });
        if(!logo) return res.json({ status: false, msg: 'Please provide the logo' });
        if(!video) return res.json({ status: false, msg: 'Please provide the video' });
        if(!location) return res.json({ status: false, msg: 'Please provide the location' });
        if(!property) return res.json({ status: false, msg: 'Please provide the property' });
        const fetch_room = await adminRoomModel.findOne({title: title.toLowerCase()})
        if(fetch_room) return res.json({ status: false, msg: 'The room already exists' });
        const date = Date.now()
        var fileName =_id+(date)+".png"
        require("fs").writeFile(path.join("public/images/Room/"+fileName), logo, "base64", function(err) {
            console.log(err);
        });
        const URL = req.protocol+"://"+req.headers.host
        const finalImage = URL+"/images/Room/"+fileName;
        const addRoom = new adminRoomModel({
            hotelId: hotelId,
            title: title,
            subTitle: subTitle,
            description: description,
            video: video,
            logo: finalImage,
            property: JSON.stringify(property),
            location:location,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addRoom.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addRoom})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


module.exports = {
    add: add
}
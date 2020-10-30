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


const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const {title, sub_title, description, logo} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!title) return res.status(404).json({ status: false, msg: 'Please provide the title.' });
        if(!sub_title) return res.status(404).json({ status: false, msg: 'Please provide the sub title.' });
        if(!description) return res.json({ status: false, msg: 'Please provide the description' });
        if(!logo) return res.json({ status: false, msg: 'Please provide the logo' });
        const fetch_room_category = await adminRoomCategoryModel.findOne({title: title.toLowerCase()})
        if(fetch_room_category) return res.json({ status: false, msg: 'The room category already exists' });
        const date = Date.now()
        var fileName =_id+(date)+".png"
        require("fs").writeFile(path.join("public/images/RoomCategory/"+fileName), logo, "base64", function(err) {
            console.log(err);
        });
        const URL = req.protocol+"://"+req.headers.host
        const finalImage = URL+"/images/RoomCategory/"+fileName;
        const addRoomCategory = new adminRoomCategoryModel({
            title: title,
            subTitle: sub_title,
            description: description,
            logo: finalImage,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addRoomCategory.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addRoomCategory})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


module.exports = {
    add: add
}
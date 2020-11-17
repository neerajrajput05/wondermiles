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
const adminSliderModel = require('../../models/slider')


const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { title, description, image} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!title) return res.status(404).json({ status: false, msg: 'Please provide the title.' });
        if(!description) return res.json({ status: false, msg: 'Please provide the description' });
        if(!image) return res.json({ status: false, msg: 'Please provide the logo' });
        const fetch_slider = await adminSliderModel.findOne({title: title.toLowerCase()})
        if(fetch_slider) return res.json({ status: false, msg: 'The slider already exists' });
        const date = Date.now()
        var fileName =_id+(date)+".png"
        require("fs").writeFile(path.join("public/images/Slider/"+fileName), image, "base64", function(err) {
            console.log(err);
        });
        const URL = req.protocol+"://"+req.headers.host
        const finalImage = URL+"/images/Slider/"+fileName;
        const addSlider = new adminSliderModel({
            title: title,
            description: description,
            image: finalImage,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addSlider.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addSlider})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}

const sliderList = async(req, res, next) =>{
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_slider = await adminSliderModel.find()
        if(!fetch_slider) return res.status(404).status(404).json({status:false, msg:'Slider not exists'})
        return res.status(200).json({status:true, msg: 'Successfully getting.', data: fetch_slider})
    
        
    } catch (error) {        
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


module.exports = {
    add: add,
    sliderList: sliderList
}
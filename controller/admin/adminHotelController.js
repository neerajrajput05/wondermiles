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
const adminHotelAminities = require('../../models/hotelAminities')
const adminHotelTerm = require('../../models/hotelTerm')
let blob = require('based-blob');
const atob = require("atob");



const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { categoryId, title, subTitle, type, description, video, logo, aminities, rules, location, callUs, code, featured} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_category = await adminCategoryModel.find({_id:categoryId})
        if(!fetch_category) return res.status(404).status(404).json({status:false, msg:'Category not exists'})
        if(!title) return res.status(404).json({ status: false, msg: 'Please provide the title.' });
        if(!subTitle) return res.status(404).json({ status: false, msg: 'Please provide the sub title.' });
        if(!type) return res.status(404).json({ status: false, msg: 'Please provide the type.' });
        if(!description) return res.json({ status: false, msg: 'Please provide the description' });
        if(!logo) return res.json({ status: false, msg: 'Please provide the logo' });
        if(!video) return res.json({ status: false, msg: 'Please provide the video' });
        if(!aminities) return res.json({ status: false, msg: 'Please provide the aminities' });
        if(!rules) return res.json({ status: false, msg: 'Please provide the rules' });
        if(!location) return res.json({ status: false, msg: 'Please provide the location' });
        if(!callUs) return res.json({ status: false, msg: 'Please provide the callUs' });
        if(!code) return res.json({ status: false, msg: 'Please provide the code' });
        const fetch_code = await adminHotelModel.findOne({code: code})
        // if(fetch_code) return res.json({ status: false, msg: 'Please provide a new code.' });
        const fetch_hotel = await adminHotelModel.findOne({title: title.toLowerCase()})
        // return res.json({data: aminities})
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
            type: type,
            description: description,
            video: video,
            logo: finalImage,
            rules: JSON.stringify(rules),
            location:location,
            code: code,
            callUs: JSON.stringify(callUs),
            createdById: _id,
            featured: (featured) ? true : false,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        // await addHotel.save()
        addHotel.save((err) => {

            if (err) {
              console.log(err);
              const ErrorMessage = substringFunction(err.toString(), '#', 'b') // Fetching the Error message after hash
              return res.status(500).send({ status: false, msg: `${ErrorMessage}` })
            }
            else {
                var dataTosent = [];
                aminities.forEach(async (e, index) => {
                    // console.log('e', e, 'index', index)
                    dataTosent.push({hotelId: addHotel._id, aminitiesId : e, type:'aminities', createdById:_id,createdAt: timeStamp,updatedAt: timeStamp})
                });
                const insertHotelAminities = adminHotelAminities.collection.insertMany(dataTosent) 
                return res.status(200).json({status:true, msg: 'Successfully added.', data: addHotel})                
            }

          })
        
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
        const fetch_hotel = await adminHotelModel.aggregate([
            {
                $lookup: {
                    from: "categories",
                    as: "categoriesType",
                    let: {
                        typeId: "$type"
                    },
                    pipeline: [
                        { $addFields: { _id: { $toString: "$_id" } } },
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$typeId"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$categoriesType",
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
        // return res.send(fetch_hotel)
        if(!fetch_hotel) return res.status(404).status(404).json({status:false, msg:'hotel not exists'})
        return res.status(200).json({status:true, msg: 'Successfully getting.', data: fetch_hotel})
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
        
    }
}

const HotelPreview = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { hotelId } = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_hotel = await adminHotelModel.findOne({_id: hotelId})
        if(!fetch_hotel) return res.status(404).status(404).json({status:false, msg:'The hotel not exists'})
        const fetch_hotelAminities = await adminHotelAminities.aggregate([
            
            {
                $match: { hotelId: fetch_hotel._id, type: "aminities" }
            },  
            {
                $lookup: {
                    from: "aminities",
                    as: "aminitiesView",
                    let: {
                        aminitiesId: "$aminitiesId"
                    },
                    pipeline: [
                        { $addFields: { _id: { $toString: "$_id" } } },
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$aminitiesId"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$aminitiesView",
                    preserveNullAndEmptyArrays: true
                }
            }
            
        ])

        const fetch_logo = await adminHotelTerm.find({hotelId: hotelId, type: "image"})
        if(!fetch_logo) return res.status(404).status(404).json({status:false, msg:'The hotel logo not exists'})
        return res.status(200).json({status: true, msg:'successfully getting', data: fetch_hotel, aminities: fetch_hotelAminities, rules: JSON.parse(fetch_hotel.rules), callus: JSON.parse(fetch_hotel.callUs), hotellogo: fetch_logo})
        

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})        
    }
}

const addHotelLogo = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { hotelId, name, logo } = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!hotelId) return res.status(404).json({ status: false, msg: 'Please provide the hotel id.' });
        if(!name) return res.status(404).json({ status: false, msg: 'Please provide the name.' });
        if(!logo) return res.status(404).json({ status: false, msg: 'Please provide the logo.' });
        const fetch_hotel = await adminHotelModel.find({_id:hotelId})
        if(!fetch_hotel) return res.status(404).status(404).json({status:false, msg:'The hotel not exists'})
        const date = Date.now()
        var fileName =_id+(date)+".png"
        require("fs").writeFile(path.join("public/images/Hotel/"+fileName), logo, "base64", function(err) {
            console.log(err);
        });
        const URL = req.protocol+"://"+req.headers.host
        const finalImage = URL+"/images/Hotel/"+fileName;
        const addHotel_logo = new adminHotelTerm({
            hotelId: hotelId,
            type: 'image',
            name: name,
            images: finalImage,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        })

        await addHotel_logo.save()
        return res.status(200).json({status:true,msg:'successfully added.', data: addHotel_logo})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})                
    }
}



module.exports = {
    add: add,
    hotelList: hotelList,
    HotelPreview: HotelPreview,
    addHotelLogo: addHotelLogo
}
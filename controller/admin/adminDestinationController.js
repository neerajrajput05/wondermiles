var jwt = require('jsonwebtoken');
const admin = require('../../models/user');
const timeStamp = Date.now();
const validator = require('validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const config = require('../../config/database');
const path = require('path')
const token_decode = require('../../logic/token_decode')
const adminCategoryModel = require('../../models/category');
const adminDestinationModel = require('../../models/destination');


const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const {name, city, description, image, parent} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!city) return res.status(404).json({ status: false, msg: 'Please provide the city' });
        if(!description) return res.status(404).json({ status: false, msg: 'Please provide the description' });
        if(!image) return res.status(404).json({ status: false, msg: 'Please provide the image' });
        const date = Date.now()           
        if(name === "" || name === "select"){
            var fileName =_id+(date)+".png" 
            const fetch_destination = await adminDestinationModel.findOne({name: city.toLowerCase(), parent: parent, type:'state'})
            if(fetch_destination) return res.status(404).json({ status: false, msg: 'This state already exists' });
            require("fs").writeFile(path.join("public/images/Destination/"+fileName), image, "base64", function(err) {
                console.log(err);
            });
            const URL = req.protocol+"://"+req.headers.host
            const finalImage = URL+"/images/Destination/"+fileName;
            const addState = new adminDestinationModel({
                name: city,
                description: description,
                type: 'state',
                parent: parent,
                image: finalImage,
                createdById: _id,
                createdAt: timeStamp,
                updatedAt: timeStamp
            })
            await addState.save()
            return res.status(200).json({status:true, msg: 'Successfully added.', data: addState})
        }
        else{
            var fileName =_id+(date)+".png" 
            const fetch_city = await adminDestinationModel.findOne({name: city.toLowerCase(), parent:name, type: 'city'})
            if(fetch_city) return res.status(404).json({ status: false, msg: 'This city already exists' });
            require("fs").writeFile(path.join("public/images/Destination/"+fileName), image, "base64", function(err) {
                console.log(err);
            });
            const URL = req.protocol+"://"+req.headers.host
            const finalImage = URL+"/images/Destination/"+fileName;
            const addCity = new adminDestinationModel({
                name: city,
                description: description,
                type: 'city',
                parent: name,
                image: finalImage,
                createdById: _id,
                createdAt: timeStamp,
                updatedAt: timeStamp
            })
            await addCity.save()
            return res.status(200).json({status:true, msg: 'Successfully added.', data: addCity})
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}

const typeList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { type } = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_state = await adminDestinationModel.find({status:true, type: type}).sort({name: 1})
        if(!fetch_state) return res.status(404).json({status:false, msg:`${type} not found.`})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_state})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})        
    }
}


const destinationList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_destination = await adminDestinationModel.aggregate([
            {
                $match: { type: "country", parent:"0" }
            }, 
            {
                $addFields: {
                    "_id": { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "destinations",
                    let: {
                        stateId: "$_id",
                        type: "state"
                    },
                    as: "state",
                    pipeline: [
                        { $addFields: { _id: { $toString: "$_id" } } },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq:  ["$parent", "$$stateId"]},
                                        { $eq:  ["$type", "$$type"]}
                                    ]
                                }
                            },
                        },
                        {
                            $sort: { "name": 1 } 
                        },
                        {
                            $unwind: {
                                path: "$state",
                                preserveNullAndEmptyArrays: true
                            }  
                        },
                        {
                            $lookup: {
                                from: "destinations",
                                let: {
                                    cityId: "$_id"
                                },
                                as: "city",
                                pipeline: [
                                    { $addFields: { _id: { $toString: "$_id" } } },
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq:  ["$parent", "$$cityId"]},
                                                    { $eq:  ["$type", "city"]}
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $sort: { "name": 1 } 
                                    },
                                    {
                                        $unwind: {
                                            path: "$city",
                                            preserveNullAndEmptyArrays: true
                                        }  
                                    },
                                ]

                            }
                        }   
                    ]
                }
            }
                                                     
        ])
        return res.send(fetch_destination)
        if(!fetch_destination) return res.status(404).json({status:false, msg:'Destination not found.'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_destination})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})        
    }
}

const subcategoryList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { categoryId, type } = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_category = await adminCategoryModel.aggregate([
            {
                $match: { parent: categoryId }
            }
            ])
            // return res.send(fetch_category)
        if(!fetch_category) return res.status(404).json({status:false, msg:'Category not found.'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_category})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})        
    }
}

const editCategory = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { categoryId, newName, newDescription, newImage } = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!newName) return res.status(404).json({ status: false, msg: 'Please provide the name' });
        if(!newDescription) return res.status(404).json({ status: false, msg: 'Please provide the description' });
        const fetch_category = await adminCategoryModel.findOne({_id:categoryId})
        if(!fetch_category) return res.status(404).json({status:false, msg:'Category not found.'})
        const date = Date.now();
        if(fetch_category.image !== newImage)
        {
            var fileName =_id+String(date)+".png";
            
            require('fs').writeFile(path.join("public/images/Category/"+fileName), newImage, "base64", function(err){
                console.log(err);
            });
            const URL = req.protocol+"://"+req.headers.host
            var finalImage = URL+"/images/Category/"+fileName;
        }
        else{
            var finalImage = fetch_category.image
        }
        console.log('final', finalImage)
        fetch_category.name = newName
        fetch_category.description = newDescription
        fetch_category.image = finalImage
        await fetch_category.save()
        return res.status(200).json({status:true, msg:'successfully updated', data: fetch_category})      
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})                
    }
}

const previewCategory = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { categoryId} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_category = await adminCategoryModel.findOne({_id:categoryId})
        if(!fetch_category) return res.status(404).json({status:false, msg:'Category not found.'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_category})      
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})                
    }
}


module.exports = {
    add: add,
    destinationList: destinationList,
    typeList: typeList,
    subcategoryList: subcategoryList,
    editCategory: editCategory,
    previewCategory: previewCategory
}
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


const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const {name, description, image, type, parent} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!name) return res.status(404).json({ status: false, msg: 'Please provide the name' });
        if(!description) return res.status(404).json({ status: false, msg: 'Please provide the description' });
        if(!image) return res.status(404).json({ status: false, msg: 'Please provide the image' });
        if(!type) return res.status(404).json({ status: false, msg: 'Please provide the type' });
        const fetch_category = await adminCategoryModel.findOne({name: name.toLowerCase()})
        if(fetch_category) return res.status(404).json({ status: false, msg: 'This category already exists' });
        const date = Date.now()
        var fileName =_id+(date)+".png"
        require("fs").writeFile(path.join("public/images/Category/"+fileName), image, "base64", function(err) {
            console.log(err);
        });
        const URL = req.protocol+"://"+req.headers.host
        const finalImage = URL+"/images/Category/"+fileName;
        const addCategory = new adminCategoryModel({
            name: name,
            description: description,
            type: type,
            parent: parent,
            image: finalImage,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addCategory.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addCategory})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


const categoryList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const { type } = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_category = await adminCategoryModel.find({type:type})
        if(!fetch_category) return res.status(404).json({status:false, msg:'Category not found.'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_category})
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
                $match: { parent: categoryId, type: type }
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
    categoryList: categoryList,
    subcategoryList: subcategoryList,
    editCategory: editCategory,
    previewCategory: previewCategory
}
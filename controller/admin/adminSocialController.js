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
const adminSocialModel = require('../../models/social')

const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const {name, link} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!name) return res.status(404).json({ status: false, msg: 'Please provide the name' });
        if(!link) return res.status(404).json({ status: false, msg: 'Please provide the link' });
        const fetch_social = await adminSocialModel.findOne({name: name.toLowerCase()})
        if(fetch_social) return res.status(404).json({ status: false, msg: 'This social link already exists' });
        const addSocial = new adminSocialModel({
            name: name,
            link:link,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addSocial.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addSocial})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


const socialList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_social = await adminSocialModel.find()
        if(!fetch_social) return res.status(404).json({status:false, msg:'Social not found.'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_social})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})        
    }
}



module.exports = {
    add: add,
    socialList: socialList
}
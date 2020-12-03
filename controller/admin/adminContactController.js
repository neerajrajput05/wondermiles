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
const adminContactModel = require('../../models/contact')

const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const {icon, name, detail} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!icon) return res.status(404).json({ status: false, msg: 'Please provide the icon' });
        if(!name) return res.status(404).json({ status: false, msg: 'Please provide the name' });
        if(!detail) return res.status(404).json({ status: false, msg: 'Please provide the detail' });
        const fetch_contact = await adminContactModel.findOne({name: name.toLowerCase()})
        if(fetch_contact) return res.status(404).json({ status: false, msg: 'This contact already exists' });
        const addContact = new adminContactModel({
            icon: icon,
            name: name,
            detail:detail,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addContact.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addContact})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


const contactList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_contact = await adminContactModel.find()
        if(!fetch_contact) return res.status(404).json({status:false, msg:'Contact not found.'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_contact})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})        
    }
}



module.exports = {
    add: add,
    contactList: contactList
}
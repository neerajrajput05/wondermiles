var jwt = require('jsonwebtoken');
const admin = require('../../models/user');
const timeStamp = Date.now();
const validator = require('validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const config = require('../../config/database');
const path = require('path')
const token_decode = require('../../logic/token_decode')
const adminAminitiesModel = require('../../models/aminities')


const add = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const {name, logo} = req.body
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        if(!name) return res.status(404).json({ status: false, msg: 'Please provide the name' });
        if(!logo) return res.status(404).json({ status: false, msg: 'Please provide the logo' })
        const fetch_aminities = await adminAminitiesModel.find({name: name.toLowerCase()})
        if(!fetch_aminities) return res.status(404).json({ status: false, msg: 'Aminities already exists.' })
        const addAminities = new adminAminitiesModel({
            name: name,
            logo: logo,
            createdById: _id,
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addAminities.save()
        return res.status(200).json({status:true, msg: 'Successfully added.', data: addAminities})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}


const aminitiesList = async(req, res, next) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).status(404).json({status:false, msg:'Admin not exists'})
        const fetch_aminities = await adminAminitiesModel.find()
        if(!fetch_aminities) return res.status(404).json({status:false, msg:'Aminities not found.'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_aminities})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})        
    }
}


module.exports = {
    add: add,
    aminitiesList: aminitiesList
}
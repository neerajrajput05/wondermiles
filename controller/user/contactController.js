var jwt = require('jsonwebtoken');
const user = require('../../models/user');
const timeStamp = Date.now();
const validator = require('validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const config = require('../../config/database');
const path = require('path')
const roomModel = require('../../models/room')
const hotelModel = require('../../models/hotel')
const sliderModel = require('../../models/slider')
const socialModel = require('../../models/social')
const contactModel = require('../../models/contact')


const contactPage = async(req, res, next) => {
    try {
        const fetch_contact = await contactModel.find()
        if(!fetch_contact) return res.status(404).json({status:false, msg:'The contact not found.'})
        return res.json({status: true, msg:'successfully getting', data: fetch_contact})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg: 'something went wrong'})
    }
}



module.exports = {
    contactPage: contactPage
}
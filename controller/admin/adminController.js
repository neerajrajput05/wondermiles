var jwt = require('jsonwebtoken');
const admin = require('../../models/user');
const timeStamp = Date.now();
const validator = require('validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const config = require('../../config/database');
const path = require('path')
const token_decode = require('../../logic/token_decode')

const signin = async(req, res, next) => {
    try{
        const { email, password } = req.body;
        if(!email) return res.json({ status: false, msg: 'Please provide email' });
        if(!validator.isEmail(email)) return res.json({ status: false, msg: `Please provide a valid email` });
        if(!password) return res.json({ status: false, msg: 'Please provide a password' })
        const check_admin = await admin.findOne({email:email, role:'admin'});
        if(!check_admin) return res.json({ status: false, msg: 'No admin exists' });
        const decyPassword = cryptr.decrypt(check_admin.password);
        if(password !== decyPassword) return res.json({ status: false, msg: 'email and password is not match' });
        const token = jwt.sign(check_admin.toJSON(), config.secretkey);
        return res.status(200).json({ status: true, msg: 'successfully login', data: check_admin, token: token })
        
    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({ status: false, msg: 'something went wrong' })
    }
}


const profile = async(req, res, next ) => {
    try {
        const { token } = req.headers
        const { _id, email } = token_decode(token)
        const fetch_admin = await admin.findOne({_id:_id, role:'admin'})
        if(!fetch_admin) return res.status(404).json({status:false, msg:'Admin not exists'})
        return res.status(200).json({status:true, msg:'successfully getting', data: fetch_admin})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, msg: 'something went wrong' })
    }
}



module.exports = {
    signin: signin,
    profile: profile
}
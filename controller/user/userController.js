var jwt = require('jsonwebtoken');
const user = require('../../models/user');
const timeStamp = Date.now();
const validator = require('validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const config = require('../../config/database');
const path = require('path')


const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password,country_code, phone } = req.body;
        if(!first_name) return res.json({ status: false, msg: 'Please provide the first name' });
        if(!last_name) return res.json({ status: false, msg: 'Please provide the last name' });
        if(!email) return res.json({ status: false, msg: 'Please provide the email' });
        if(!validator.isEmail(email)) return res.json({ status: false, msg: 'Please provide the valid email' });
        if(!password) return res.json({ status: false, msg: 'Please provide a password' })
        if(!phone) return res.json({ status: false, msg: 'Please provide a phone number' });
        if(!country_code) return res.json({ status: false, msg: 'Please provide a country code' });
        const fetch_user = await user.findOne({ email:email, role: 'customer'});
        if(fetch_user) return res.json({ status: false, msg: 'email already exist' });
        const encyPassword = cryptr.encrypt(password);
        const addUser = new user({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: encyPassword,
            country_code: country_code,
            phone: phone,
            role: "customer",
            createdAt: timeStamp,
            updatedAt: timeStamp
        });
        await addUser.save();
        return res.status(200).json({ status: true, msg: 'successfully registered', data: addUser })
    } catch (error) {
        console.log('error', error);
    }
}

const signin = async(req, res, next) => {
    try{
        const { email, password } = req.body;
        if(!email) return res.json({ status: false, msg: 'Please provide email' });
        if(!validator.isEmail(email)) return res.json({ status: false, msg: `Please provide a valid email` });
        if(!password) return res.json({ status: false, msg: 'Please provide a password' })
        const check_user = await user.findOne({email:email});
        if(!check_user) return res.json({ status: false, msg: 'No user exists' });
        const decyPassword = cryptr.decrypt(check_user.password);
        if(password !== decyPassword) return res.json({ status: false, msg: 'email and password is not match' });
        const token = jwt.sign(check_user.toJSON(), config.secretkey);
        return res.status(200).json({ status: true, msg: 'successfully login', data: check_user, token: token })
        
    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({ status: false, msg: 'something went wrong' })
    }
}

const profile = async(req, res, next) => {
    try{
        const { token } = req.headers;
        const { _id } = token_decode(token);
        const fetch_user = await user.findOne({ _id:_id });
        if(!fetch_user) return res.json({ status: false, msg: 'Profile not found' });
        return res.status(200).json({ status: true, msg:'Profile Found', data: fetch_user });
    }
    catch(e){
        console.log(e);
        return res.json({ status: false, msg:'something went wrong' });
    }
}






module.exports = {
    register : register,
    signin: signin,
    profile: profile
}
const jwt = require('jsonwebtoken');
const config = require('../config/database');

token_decode=(token)=>{
    try{
        // console.log(token)
        const decode = jwt.verify(token, config.secretkey);
        if(decode){
            return decode;
        }
        return false;
    }
    catch(e){
        return false;
    }
}
module.exports = token_decode;
var express = require('express');
var router = express.Router();
const adminController = require('../controller/admin/adminController')
const verifyToken = require('../controller/authController');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', adminController.signin)
router.post('/profile', adminController.profile)

module.exports = router;

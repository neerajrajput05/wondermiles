var express = require('express');
var router = express.Router();
const userController = require('../controller/user/userController')
const verifyToken = require('../controller/authController');
const landingController = require('../controller/user/landingController')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/register', userController.register)
router.post('/login', userController.signin)
router.post('/profile', verifyToken, userController.profile)

/*** Landing Pages Api */
router.get('/landingPalaceAccomdation', landingController.landingPalaceAccomdation)
router.get('/landingHotelAccomdation', landingController.landingHotelAccomdation)
router.get('/landingSlider', landingController.landingSlider)

module.exports = router;

var express = require('express');
var router = express.Router();
const adminController = require('../controller/admin/adminController')
const verifyToken = require('../controller/authController');
const adminCategoryController = require('../controller/admin/adminCategoryController')
const adminRoomCategoryController = require('../controller/admin/adminRoomCategoryController')
const adminHotelController = require('../controller/admin/adminHotelController')
const adminRoomController = require('../controller/admin/adminRoomController')
const adminSliderController = require('../controller/admin/adminSliderController')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', adminController.signin)
router.post('/profile', verifyToken, adminController.profile)

/*** User List */
router.post('/userList', verifyToken, adminController.userList)

/** Category */
router.post('/addCategory', verifyToken, adminCategoryController.add)


/** Slider */
router.post('/addSlider', verifyToken, adminSliderController.add)

/** Room Category */
router.post('/addRoomCategory', verifyToken, adminRoomCategoryController.add)

/** Hotel */
router.post('/addHotel', verifyToken, adminHotelController.add)

/** Room */
router.post('/addRoom', verifyToken, adminRoomController.add)



module.exports = router;

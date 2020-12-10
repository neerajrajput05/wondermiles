var express = require('express');
var router = express.Router();
const adminController = require('../controller/admin/adminController')
const verifyToken = require('../controller/authController');
const adminCategoryController = require('../controller/admin/adminCategoryController')
const adminRoomCategoryController = require('../controller/admin/adminRoomCategoryController')
const adminHotelController = require('../controller/admin/adminHotelController')
const adminRoomController = require('../controller/admin/adminRoomController')
const adminSliderController = require('../controller/admin/adminSliderController');
const adminAminitesController = require('../controller/admin/adminAminitesController');
const adminSocialController = require('../controller/admin/adminSocialController');
const adminContactController = require('../controller/admin/adminContactController');
const adminDestinationController = require('../controller/admin/adminDestinationController')

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
router.post('/editCategory', verifyToken, adminCategoryController.editCategory)
router.post('/previewCategory', verifyToken, adminCategoryController.previewCategory)
router.post('/categoryList', verifyToken, adminCategoryController.categoryList)
router.post('/subcategoryList', verifyToken, adminCategoryController.subcategoryList)

/**** Aminities Hotel */
router.post('/addAminities', verifyToken, adminAminitesController.add)
router.post('/aminitiesList', verifyToken, adminAminitesController.aminitiesList)

/** Slider */
router.post('/addSlider', verifyToken, adminSliderController.add)
router.post('/sliderList', verifyToken, adminSliderController.sliderList)
router.post('/editSlider', verifyToken, adminSliderController.editSlider)
router.post('/previewSlider', verifyToken, adminSliderController.previewSlider)

/** Room Category */
router.post('/addRoomCategory', verifyToken, adminRoomCategoryController.add)

/** Hotel */
router.post('/addHotel', verifyToken, adminHotelController.add)
router.post('/hotelList', verifyToken, adminHotelController.hotelList)
router.post('/singleHotel', verifyToken, adminHotelController.HotelPreview)
router.post('/addHotelLogo', verifyToken, adminHotelController.addHotelLogo)


/*** Destination  */
router.post('/addDestination', verifyToken, adminDestinationController.add)
router.post('/destinationList', verifyToken, adminDestinationController.destinationList)
router.post('/previewDestination', verifyToken, adminDestinationController.previewDestination)
router.post('/editDestination', verifyToken, adminDestinationController.editDestination)
router.post('/typeList', verifyToken, adminDestinationController.typeList)

/** Room */
router.post('/addRoom', verifyToken, adminRoomController.add)

/*** Add Social Link */
router.post('/addSocial', verifyToken, adminSocialController.add)
router.post('/socialList', verifyToken, adminSocialController.socialList)

/*** Add Contact */

router.post('/addContact', verifyToken, adminContactController.add)
router.post('/contactList', verifyToken, adminContactController.contactList)



module.exports = router;

const express = require('express');
const router = express.Router();
const authCtrl = require('./controllers/auth-controller');
const dataCtrl = require('./controllers/data-controller');

// categories
const CategoriesController = require('./controllers/categories-controller')

// inner store
const InnerStore = require('./controllers/inner-store-controller')
// const Routes = [
//     ...authCtrl
// ];

router.post('/signup', authCtrl.userSignup);
router.post('/login', authCtrl.userLogin);
router.post('/forgot_password', authCtrl.forgotPassword);
router.post('/sign_in_google_fb', authCtrl.signInWithGoogleFb);
router.post('/email_verfiy_otp', authCtrl.emailVerifyOtp);
router.post('/update_user_profile_info', authCtrl.updateProfileInformation);
router.post('/update_user_new_password', authCtrl.updatePasswordInformation);
router.post('/logout', authCtrl.userLogout);
router.post('/admin_login', authCtrl.adminLogin);
router.post('/admin_logout', authCtrl.adminLogout);

router.get('/getdata', dataCtrl.getAllStores);
router.post('/get/categories', CategoriesController.getCategoriesList);
router.get('/get/shopcategories', CategoriesController.shopCategoriesList);
router.get('/get/onlinestoredata', CategoriesController.onlinestoredata);
router.get('/get/maincategories', CategoriesController.CategoriesList);

router.post('/get/coupons/details', InnerStore.getCouponsList);
router.post('/post/coupon/code', InnerStore.postCouponsCode);
router.post('/check_coupon_validity', InnerStore.checkCouponValidity);
// to check server working or not
router.get('/endpoint/check', InnerStore.checkServerWorks);

module.exports = router;
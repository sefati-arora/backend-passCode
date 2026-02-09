const express=require("express");
const adminController=require("../controller/adminController")
const userController=require("../controller/userController")
const{authentication}=require("../middleware/authentication")
const router=express.Router();
router.post('/adminLogin',adminController.adminLogin)
router.post('/otpVerify/:email',authentication,adminController.otpVerify)
router.post('/logOut',authentication,adminController.logOut)
router.post('/userFetch',authentication,adminController.userFetch)
router.post('/EditPasscode',authentication,adminController.EditPasscode)
router.post('/bookingFetch',authentication,adminController.bookingFetch)
router.get('/DashBoardData',authentication,adminController.DashBoardData)
router.post('/verifyPasscode',authentication,adminController.verifyPasscode)
//userController.............................................
router.post('/signUp',userController.signUp)
router.post('/logIn',authentication,userController.logIn)
router.post('/userLogout',authentication,userController.userLogout)
router.post('/bookingCreation',authentication,userController.bookingCreation)
module.exports=router
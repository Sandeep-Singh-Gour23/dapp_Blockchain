const express = require("express");
const router  = express.Router();
const UserAuthController=require("../controllers/index").UserAuthController;
const ReqController=require("../controllers/index").ReqController;
const ReqssController=require('../controllers/index').ReqssController;
const ReqspController=require("../controllers/index").ReqspController;
const UserController=require("../controllers/index").UserController;
const DonationController=require("../controllers/index").DonationController

const VerifyUserJWT=require("../middleware/jwt").VerifyUserJWT;
const upload = require("../middleware/upload");

//CHECK ROUTES
router.get("/check",VerifyUserJWT,(req,res)=>{
    console.log("Value fetched from token userid, accHash, email")
    console.log(req.user.id);
    console.log(req.user.accHash);
    console.log(req.user.email);

res.send("Welcome ! Everything is perfectly setUp")
});

router.get("/checkHeroku",(req,res)=>{
    res.send("Welcome ! Heroku deployement is perfectly done")
});

router.get("/check2",(req,res)=>{
    res.send("Welcome ! Heroku deployement is perfectly done 2")
});

//AUTHENTICATION routes
router.post('/signup',UserAuthController.SignUp);
router.post('/login',UserAuthController.Login);
router.post('/changeuserpassword',VerifyUserJWT,UserAuthController.ChangePassword);
router.post('/delete',UserAuthController.Delete);
router.get('/fetch',UserAuthController.FetchAll);

//AID routes
//router.get('/aidAnalysis',ReqController.AidAnalysis);

//AidInformation pagination
router.get('/aidInfo/:pgno/:size',ReqssController.AidInfo);

//aid Details by Id
router.post('/aidDetailsById',ReqssController.AidDetailsById);

// user profile data
router.get('/userDetails',VerifyUserJWT,UserController.userDetails);



//Dashboard routes
// no of donation, transaction, total user, demands
router.get('/aidAnalysis',ReqController.AidAnalysis);

//DEmands fullfill, remaining demanads
router.get('/analytics',UserController.Analytics);

// to upload USER profile image 
router.post('/imageUpload',VerifyUserJWT,upload.single("image"),UserController.uploadImage);


//AID Request form 
router.post('/aidreq',VerifyUserJWT,ReqspController.AidRequestForm);

//Donate routes after donation route call
router.post('/donate',VerifyUserJWT,ReqspController.DonateForm);


//Donation Details routes
router.get('/recentDonation',DonationController.RecentDonation);
router.get('/topDonation',DonationController.TopDonation);

module.exports = router;
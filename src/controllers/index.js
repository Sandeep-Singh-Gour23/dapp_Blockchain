const UserAuthController=require("./authentication/authControllers");
const ReqController=require("./requirement/reqControllers");
const ReqssController=require("./requirement/reqssController");
//const HostLocations=require("./hosts/hostLocations");
const UserController=require("./dashboard/userController");
const ReqspController=require("./requirement/reqspController");
const DonationController=require("./donation/donationController")


module.exports={
    UserAuthController,
    ReqController,
    ReqssController,
    UserController,
    ReqspController,
    DonationController
   // UserSearchController,
    //HostLocations
}
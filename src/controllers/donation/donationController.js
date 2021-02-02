const {
    okResponse,
    badRequestError,
    to,
    unverifiedError,
    loginResponse,
  } = require("../../../global_functions");
const Donate = require("../../models/donateModel");
const Requirements = require("../../models/needModel");
const Users = require("../../models/userModel");







const RecentDonation = async (req, res) => {

  const [error, recentDonator] = await to(
    Donate.query().select("donatorId", "aidId", "amount", "created_at").orderBy("created_at", "desc")


    .returning("*")
    .withGraphFetched("donatorDetails(SelectDetails)")
    .modifiers({
      SelectDetails(builder){
        builder.select("fullName", "accHash", "email", "image");
      }
     
    })
    ); 

    console.log(error);
    if(error){
      return badRequestError(res, "unable to fetch recent donation information");
    }
    else{
      console.log(recentDonator);
 
  return okResponse(res, recentDonator, " recent donation");

}
}


const TopDonation = async (req, res) => {

    const [error, topDonation] = await to(
      Donate.query().select("donatorId","amount").orderBy("amount","desc")
       
      //select("donatorId").max("amount").groupBy("donatorId")
       
  
      //.returning("*")
      .withGraphFetched("donatorDetails(SelectDetails)")
      .modifiers({
        SelectDetails(builder){
          builder.select("fullName", "accHash", "email", "image");
        }
       
      })
      ); 
  
      console.log(error);
      if(error){
        return badRequestError(res, "unable to fetch top donation information");
      }
      else{
        console.log(topDonation);
   
    return okResponse(res, topDonation, " Top donation details");
  
  }
  }
  






  module.exports = {
    RecentDonation,
    TopDonation
    };
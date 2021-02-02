const {
    okResponse,
    badRequestError,
    to,
    unverifiedError,
    loginResponse,
  } = require("../../../global_functions");
const Requirements = require("../../models/needModel");
const Users = require("../../models/userModel");
const { array } = require("../../middleware/upload");







const AidInfo = async (req, res) => {

  let size= req.params.size;
  let pgno= req.params.pgno;
  console.log(size);
  console.log(pgno);
     
  const [error, Aidinfo] = await to(
    Requirements.query().select("aidId", "category", "amount", "urgency")


    .returning("*")
    .withGraphFetched("[patientDetails(SelectFullName), ReqDon(DonatedSum) as amountDonated ]")
    .modifiers({
      SelectFullName(builder){
        builder.select("fullName");
      },
      DonatedSum(builder) {
        builder.groupBy("aidId").sum("amount");
      }
    })
    ); 
    let aidInfo= []; 
     
    console.log(error);
    if(error){
      return badRequestError(res, "unable to fetch Aid information");
    }
   else{
      console.log(Aidinfo);
    
      let start=(size*pgno)-1 ;
      console.log("start value"+start);

        for(let i=size-1;i>=0;i--)
        {
          if(Aidinfo[start]==null){
            start--;
         continue;
          }
          aidInfo[i]=Aidinfo[start];
          start--;
        
    
        }
        console.log(`final array of size ${size} and pageno ${pgno} `+JSON.stringify(aidInfo));
 
   }
  return okResponse(res, aidInfo, "Aids details");


}



  const AidDetailsById = async (req, res) => {

    const AidId = req.body.aidId;
     console.log("AidId",AidId);
  
    const [error, Aiddetails] = await to(Requirements.query().where("aidId", AidId).first()
      .withGraphFetched("[patientDetails, ReqDon(sum) as amountDonated ]")
     .modifiers({
        sum(builder){
          builder.select("aidId").groupBy("aidId").sum("amount");
        
        }
      })
      ); 
      if(error){
        return badRequestError(res, "unable to fetch Aid details");
      }
      //return okResponse(res, Aiddetails, "Aids details");
      let remainAmount;
      let status="pending";
      
  if(Aiddetails.amountDonated.length<=0){
    remainAmount=Aiddetails.amount;


    let aidDetailsById={
      Aiddetails:Aiddetails,
      status:status,
      donationRequires:remainAmount
    }
  
    return okResponse(res, aidDetailsById, "Aids details");
  

  }
  
     //console.log("Aiddetailsid",aidDetailsById);
  
     remainAmount =Number(Aiddetails.amount)-Number(Aiddetails.amountDonated[0].sum)
     console.log(remainAmount)
  
      if(remainAmount==0){
       status="completed" 
      }
      else{
        status="pending";
      }
    // console.log(profiledetails)
  
    let aidDetailsById={
      Aiddetails:Aiddetails,
      status:status,
      donationRequired:remainAmount
    }
  
    return okResponse(res, aidDetailsById, "Aids details");
  
  }










  module.exports = {
    AidDetailsById,
    AidInfo
    };
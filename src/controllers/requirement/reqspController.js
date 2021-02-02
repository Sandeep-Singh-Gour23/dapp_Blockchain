const {
    okResponse,
    badRequestError,
    to,
    unverifiedError,
    loginResponse,
  } = require("../../../global_functions");

  const Requirements = require("../../models/needModel");  
  const Donate = require("../../models/donateModel");
  const User = require("../../models/userModel");

const AidRequestForm = async (req, res) => {

    let patientId = req.user.id;
    console.log(patientId);
    let { description, category, image, document, contact_no, amount, urgency } = req.body;
    console.log(req.body);
    
    let [error, aidrequest_returned] = await to(
      Requirements.query().insert({
        patientId: patientId,
        description: description,
        category: category,
        image: image,
        document: document,
        contact_no: contact_no,
        amount: amount,
        urgency: urgency 
      }).returning('*')
    );
        
        if(error){ console.log("error"+error);
          return badRequestError(res, "Demand not submitted");}

        console.log("aid_returned  "+aidrequest_returned.aidId)
        return okResponse(res, "Demand has been made Successfully");
  }

  const DonateForm = async (req, res) => {
    let donatorId = req.user.id;
    //console.log(needId);
    let { amount, aidId } = req.body;
    if(amount ==null || aidId==null||donatorId==null){
      return badRequestError(res, "values can't be null");
    }

    else{
    console.log(req.body);

    let [error, donation_returned] = await to(
      Donate.query().insert({
        donatorId: donatorId,
        aidId: aidId,
        amount: amount,
      }).returning('*')
    );

    if(error){ console.log("error"+error);
    return badRequestError(res, "Donation unsuccesfull");}

    console.log("donation_returned  "+donation_returned.amount)
    return okResponse(res, "Donation has been made Successfully");
  }
  }

  module.exports = {
    AidRequestForm,
    DonateForm    
    };
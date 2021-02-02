const {
    okResponse,
    badRequestError,
    to,
    unverifiedError,
    loginResponse,
  } = require("../../../global_functions");
  const Donate = require("../../models/donateModel");
  const Requirements = require("../../models/needModel");

  const AidAnalysis = async (req, res) => {
   // let { userId, postContent,isAnonymous } = req.body;
   let Demandpending;
    const [error, AidSum] = await to(
        Requirements.query().select("aidId", "amount","document")
        .returning("*")
      //  .withGraphFetched("[ReqDon]")
        
        .withGraphFetched("[ReqDon(totalSum)]")
        .modifiers({
            totalSum(builder) {
            builder.select("aidId").groupBy("aidId").sum("amount");
          },
        })
    );
    console.log(error);
    if (error) return badRequestError(res, "unable to fetch");
    
    else{
        console.log(AidSum);

        for(let i=0;i<AidSum.length;i++){
          //console.log( "Aid sum"+ AidSum[i].ReqDon[0].sum)
          if(AidSum[i].ReqDon.length<=0){
continue;
          }
else{
        let sum= Number(AidSum[i].amount) +Number(AidSum[i].ReqDon[0].sum)
         // console.log("goal sum achieved "+ sum)
         // console.log("goal achieved" +AidSum[i].ReqDon[0].sum);
      
    if(Number(AidSum[i].amount)<=Number(AidSum[i].ReqDon[0].sum)){
     //let sum= AidSum[i].amount +AidSum[i].ReqDon.sum
     // console.log("goal achieved" );
     const [error, Dfull] = await to(
     
      Requirements.query().update({document:'yes'}).where("aidId",AidSum[i].aidId).returning("*")
      )
    
    }

    else{
     // console.log("goal not achieved" );
      
    }
  }
     
    }

    const [error2, Demandfull] = await to(
     
      Requirements.query().count("aidId").where("document",'yes')
      )

    
        const [error4, TotalAids] = await to(
          Requirements.query().count("aidId")
             )
       
 Demandpending=  Number(TotalAids[0].count)- Number( Demandfull[0].count);

      console.log("Demandpending "+ Demandpending );
    
     // console.log("count of demanfd fullfill  "+Demandfull );
      let response={
       // AidSum:AidSum,
        TotalAids:TotalAids,
        Demandfullfill: Demandfull,
        Demandpending:Demandpending
      }
    
    return okResponse(res,response, "Analysis of Demands");
}

  }


  


  module.exports = {
AidAnalysis    
};
  
  
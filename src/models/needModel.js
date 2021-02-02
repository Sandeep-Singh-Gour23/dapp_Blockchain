const { Model } = require('objection');

class Requirements extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'needs';
  }
  static get relationMappings(){
    const Donate=require("../models/donateModel");
    const User=require("../models/userModel");
    
    return{
        //Donations on requiremnets
      ReqDon:{
        relation:Model.HasManyRelation,
        modelClass:Donate,
        
        join:{
          from:"needs.aidId",
          to:"donator.aidId"
        }
      },
      // to fetch patient details like email, name, account_hash
      patientDetails:{
        relation:Model.BelongsToOneRelation,
        modelClass:User,
        join:{
          from:"needs.patientId",
          to:"user.id"
        }
      },



    }
  }
 
  }

    module.exports=Requirements;
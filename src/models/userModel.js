
// User Model 

const { Model } = require('objection');

class Users extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'user';
  }
  static get relationMappings(){
    const Donate=require("../models/donateModel");
    const Requirements=require("../models/needModel");
   
    return{
        //Donations on requiremnets
      uDonations:{
        relation:Model.HasManyRelation,
        modelClass:Donate,
        join:{
          from:"user.id",
          to:"donator.donatorId"
        }
      },

      uNeeds:{
        relation:Model.HasManyRelation,
        modelClass:Requirements,
        join:{
          from:"user.id",
          to:"needs.patientId"
        }
      },
      

      
    }
  }
 
 
    }
  

module.exports = Users;
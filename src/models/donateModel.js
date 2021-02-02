
// User Model 

const { Model } = require('objection');

class Donate extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'donator';
  }
 
  static get relationMappings(){
    const Requirements=require("../models/needModel");
    const User=require("../models/userModel");
    
    return{
      Donation:{
        relation:Model.BelongsToOneRelation,
        modelClass:Requirements,
        join:{
          from:"donator.aidId",
          to:"needs.aidId"
        }
      },

      donatorDetails:{
        relation:Model.BelongsToOneRelation,
        modelClass:User,
        join:{
          from:"donator.donatorId",
          to:"user.id"
        }
      },
      



    }

    

}
}
  
    
  

module.exports = Donate;
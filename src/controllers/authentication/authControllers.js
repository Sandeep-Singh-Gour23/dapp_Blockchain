const {
    okResponse,
    badRequestError,
    to,
    unverifiedError,
    loginResponse,
  } = require("../../../global_functions");
  const Users = require("../../models/userModel");
  const validator = require("validator");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  
  const SignUp = async (req, res) => {
    console.log(req.body);
    let { email, password, accHash,fullName } = req.body;
   // console.log("mail key", process.env.mailApiKey);
  
    //Default profile picture URL
    const userProfileImage =
      "https://res.cloudinary.com/hmwv9zdrw/image/upload/v1600970783/user_vopbzk.png";
  
  
     
      //email and password validation before inserting user
    if (!validator.isEmail(email || ""))
      return badRequestError(res, "Enter a valid email address");
    if (password === "") return badRequestError(res, "password can not be empty");
  
    let [error, result] = await to(Users.query().where("email", email).first());
    if (error) console.log(error);
    if (result) {
      console.log("result is "+result);
      return badRequestError(res, " email already exists");
    }
  
    let [err, user_inserted] = await to(
      Users.query()
        .insert({ email:email, password:password, accHash:accHash, fullName:fullName })
        .returning("*")
    );
    if (err) badRequestError(res, "unable to insert user");
  
    delete user_inserted.password;
    console.log("USER's detail ", user_inserted);

    access_token = await jwt.sign(
      { email, id: user_inserted.id,accHash:user_inserted.accHash },
      process.env.JWT_USER_SECRET,
      {
        expiresIn: "24h",
      }
    );
    console.log("access_token ", access_token);
  
    res.setHeader("Authorization", access_token);
    res.setHeader("access-control-expose-headers", "authorization");

    return okResponse(res, "user inserted successfully");
  };
  
 
  

  //Login User
  
  const Login = async (req, res) => {
    let access_token;
    console.log(req.body);
    let { email, password } = req.body;
    if (!validator.isEmail(email || ""))
      return badRequestError(res, "Enter a valid email address ");
    if (password === "") return unverifiedError(res, "password field is empty");
    let [incorrect, user_returned] = await to(
      Users.query().findOne("email", email).throwIfNotFound()
    );
  //console.log("user_returned  "+user_returned.email)
    if (incorrect) return badRequestError(res, "email does not exists");
  
    //Checking whether email is verified
    if (user_returned.email === email) {
      //checking password
     // if (await bcrypt.compare(password, user_returned.password)) {
        //Generating JWT token on correct password for USER type
  
        
         access_token = await jwt.sign(
          { email, id: user_returned.id,accHash:user_returned.accHash },
          process.env.JWT_USER_SECRET,
          {
            expiresIn: "24h",
          }
        );
             
        res.setHeader("Authorization", access_token);
        res.setHeader("access-control-expose-headers", "authorization");
  
        delete user_returned.password;
        return okResponse(res,user_returned,"loged in successfully");
      //}
      //Error returned when password is invalid
      return unverifiedError(res, "invalid password");
    }
  
}


  // Change user password
  const ChangePassword = async (req, res) => {
    let { new_password, old_password,email } = req.body;
    if (!email) return badRequestError(res, "email field is empty");
    if (!new_password || !old_password)
      return badRequestError(res, "password field is empty");
  
    let [error, user_detail] = await to(
      Users.query()
        .findOne("email", email)
        .returning("password")
        .throwIfNotFound()
    );
    if (user_detail) {
      //checking old password entered by user
      if (await bcrypt.compare(old_password, user_detail.password)) {
        //if matched then hashing new password
        let new_hashed_password = await bcrypt.hash(new_password, 10);
        let [err, password_updated] = await to(
          Users.query()
            .where("email", email)
            .update({ password: new_hashed_password })
            .throwIfNotFound()
        );
        if (password_updated)
          return okResponse(res, undefined, "password changed successfully");
      } else {
        return badRequestError(res, "old password did not match");
      }
    }
  };
  
  //ignore only for testing
  
  const Delete = async (req, res) => {
    let {fullName}=req.body;
    let [error, deleted] = await to(Users.query().where("fullName",fullName).delete().throwIfNotFound());
    if (error) badRequestError(res, "unable to delete");
    okResponse(res, deleted, "delete successfull");
  };
  

  const FetchAll = async (req, res) => {
    let {fullName}=req.body;
    let [error, fetchData] = await to(Users.query().select().throwIfNotFound());
    if (error) badRequestError(res, "unable to delete");
    okResponse(res, fetchData, "Data fetched");
  };
  
  module.exports = {
    SignUp,
    Delete,
    Login,
    ChangePassword,
    FetchAll
      };
  
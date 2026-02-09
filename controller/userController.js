require("dotenv").config();
const Models=require("../models/index");
const helper=require("../helper/validation");
const commonHelper=require("../helper/commonHelper");
const Joi=require("joi");
const jwt=require("jsonwebtoken");
const argon2=require("argon2");
const otpManager = require("node-twillo-otp-manager")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  process.env.TWILIO_SERVICE_SID,
);
module.exports=
{
    signUp:async(req,res)=>
    {
        try
        {
          const schema=Joi.object({
            firstName:Joi.string().required(),
            email:Joi.string().required(),
            password:Joi.string().required(),
            phoneNumber:Joi.string().required(),
            countryCode:Joi.string().required()
          });
          const payload=await helper.validationJoi(req.body,schema)
          const{password}=payload;
          const hash=await argon2.hash(password)
          const ObjToSave=
          {
            firstName:payload.firstName,
            email:payload.email,
            password:hash,
            phoneNumber:payload.phoneNumber,
            countryCode:payload.countryCode
          }
          const user=await Models.userModel.create(ObjToSave)
          await Models.userModel.update({role:1,deviceToken:1},{where:{id:user.id}})
          const update=await Models.userModel.findOne({where:{id:user.id}})
          const phone=payload.countryCode+payload.phoneNumber
          const otp=await otpManager.sendOTP(phone)
          console.log(otp)
          const token=jwt.sign({id:user.id},process.env.SECRET_KEY)
          return res.status(200).json({message:"USER CREATED!",update,token})
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).json({message:"ERROR"})
        }
    },
    logIn:async(req,res)=>
    {
        try
        {
          const{email,password}=req.body;
          if(!email || !password)
          {
            return res.status(400).json({message:"EMAIL AND PASSWORD REQUIRED!"})
          }
          const user=await Models.userModel.findOne({where:{email}})
          if(!user)
          {
            return res.status(401).json({message:"EMAIL NOT FOUND!"})
          }
          const pass=await argon2.verify(user.password,password)
          if(!pass)
          {
            return res.status(401).json({message:"PASSWORD MUST BE SAME"})
          }
          const token=jwt.sign({id:user.id},process.env.SECRET_KEY)
          return res.status(200).json({message:"USER LOGIN!",user,token})
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).json({message:"ERROR",error})
        }
    },
    userLogout:async(req,res)=>
    {
        try
        {
          const id=req.user.id;
          const user=await Models.userModel.findOne({id})
          if(!user)
          {
            return res.status(404).json({message:"USER NOT FOUND!"})
          }
          await Models.userModel.update({deviceToken:null},{where:{id}})
          return res.status(200).json({message:"USER LOGOUT!"})
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).json({message:"ERROR!",error})
        }
    },
    bookingCreation:async(req,res)=>
    {
        try
        {
            const userId =req.user.id;
          const{duration,DateAndTime,location,comment,latitude,longitude}=req.body
          const user=await Models.userModel.findOne({where:{id:userId}})
          if(!user)
          {
            return res.status(404).json({message:"USER NOT FOUND!"})
          }
         const booking= await Models.bookingModel.create({userId,duration,DateAndTime,location,comment,latitude,longitude})
          return res.status(200).json({message:"BOOKING CREATION",booking})
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).json({message:"ERROR!",error})
        }
    }
}
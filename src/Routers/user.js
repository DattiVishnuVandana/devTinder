const express=require('express')
const userRouter=express.Router()
const {userAuth}=require("../auth")
const {connReqModel}=require('../model/connectionReqSchema')

const USER_SAFE_DATA="firstName lastName"

userRouter.get("/user/req/recieved",userAuth,async (req,res)=>{
  try{  const loggedInUser=req.user
    const connReq=await connReqModel.find({
        toUserId:loggedInUser._id,
        status:"interested"
    }).populate("fromUserId",USER_SAFE_DATA)
    .populate("toUserId",USER_SAFE_DATA)
res.json({data:connReq})}
    catch(err){
        res.send("err"+err)
    }
})



userRouter.get("/user/connected",userAuth,async (req,res)=>{
    try{

        const loggedInUser=req.user
        const connReq=await connReqModel.find({
            $or:[
             {   fromUserId: loggedInUser._id, status:"accepted"},
              {  toUserId:loggedInUser._id,status:"accepted"}
            ]
         
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)

const data=connReq.map((row)=>{
    console.log("row");
    if(row.fromUserId.toString()===loggedInUser.toString()){
       
return row.toUserId
    }
    return row.fromUserId
})


        res.json({
            data
        })
    }catch(err){
        res.status(400).send("ERROR"+err)
    }
})

module.exports =userRouter
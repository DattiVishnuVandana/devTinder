const express=require('express')
const RequestRoute=express.Router()
const {userAuth}=require('../auth')
// const connReq =require('../model/connectionReqSchema')
const {connReqModel}= require('../model/connectionReqSchema')
const {userSchema,Usermodel }= require('../model/user');



RequestRoute.post('/connectionReq/send/:status/:toUserId',userAuth,async (req,res)=>{
    const fromUserId=req.user._id
    const toUserId=req.params.toUserId
    const status=req.params.status
try{
    const allowedStatus=["ignored","interested"]
    if(!allowedStatus.includes(status)){
return res.status(400).json({msg:"invalid status type"+status})
    }



    const connReq = new connReqModel({
        fromUserId,
        toUserId,
        status
    });


    // const existingReq=await connReqModel.findOne({
    //     $or:[
    //         {fromUserId,toUserId},
    //         {fromUserId:toUserId,toUserId:fromUserId}
    //     ]
    // })
    // if(existingReq){
    //     return res.status(400).send("user already exists ...")
    // }
    // const User=await Usermodel.findById(toUserId)
    // if(User){
    //     return res.send(User)
    // }
    const data=await connReq.save()
    res.send({
        msg:"connection req sent succesfully",
        data
    })}catch(err){
        res.status(400).send("somme issue"+err)
    }
})

module.exports=RequestRoute
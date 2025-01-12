const express=require('express')
const RequestRoute=express.Router()
const {userAuth}=require('../auth')


RequestRoute.post('/sendconnection',userAuth,(req,res)=>{
    const user=req.user
    console.log("connection request was sent ");
    res.send(user.firstName+"sent request")
})

module.exports=RequestRoute
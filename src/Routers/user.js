const express=require('express')
const userRouter=express.Router()
const {userAuth}=require("../auth")
const {connReqModel}=require('../model/connectionReqSchema')
const {Usermodel} = require('../model/user')

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



userRouter.get("/user/feed",userAuth,async (req,res)=>{
    const page=parseInt(req.query.page)||1
    let limit=parseInt(req.query.limit)||2
    const skip=(page-1)*limit
    limit= (limit>3)?3:limit
try{

const loggedInUser=req.user
console.log("conreqq....");
const connReq=await(connReqModel).find({
$or:[
   { fromUserId:loggedInUser._id},
   {toUserId:loggedInUser._id}
]

})
.select("fromUserId toUserId ").populate("fromUserId").populate("toUserId","firstName")

console.log(connReq);

// const hideUserFeed=new Set();
// connReq.forEach(req=>{
//     hideUserFeed.add(req.fromUserId)
//     hideUserFeed.add(req.toUserId)
// })
// console.log("hideuser feed"+hideUserFeed);



const user=await Usermodel.find({
    $and:[
        // {_id:{$nin:Array.from(hideUserFeed)}},
        {_id:{$ne:loggedInUser._id}}
    ]
}).select().skip(skip).limit(limit)

console.log(user);
res.json({data:user,
    connreq:connReq
})

}catch(err){
res.status(400).send("error"+err)
}


})

module.exports =userRouter
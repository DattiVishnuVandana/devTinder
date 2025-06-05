const express=require('express')
const userRouter=express.Router()
const {userAuth}=require("../auth")
const {connReqModel}=require('../model/connectionReqSchema')
const {Usermodel} = require('../model/user')
const mongoose=require('mongoose')
const USER_SAFE_DATA="firstName lastName age gender photoUrl"

userRouter.post("/user/req/test", async (req, res) => {
  try {
    const connReq = await connReqModel.create({
      fromUserId: "6792323ce3081a852cc2db4e", // sender
      toUserId: "679232ade3081a852cc2db58",   // receiver (your logged-in user)
      status: "interested"
    });
    res.json({ message: "Test connection request created", connReq });
  } catch (err) {
    res.status(500).json({ error: "Error creating test data", details: err.message });
  }
});


userRouter.get("/user/req/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("Logged in user:", loggedInUser);

    const connReq = await connReqModel.find({
      toUserId: loggedInUser._id,
      status: "interested"
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

    console.log("Connection Requests:", connReq);

    res.json({ data: connReq });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// userRouter.get("/user/req/recieved",userAuth,async (req,res)=>{
//   try{  const loggedInUser=req.user
//     const connReq=await connReqModel.find({
//         toUserId:loggedInUser._id,
//         status:"interested"
//     }).populate("fromUserId",USER_SAFE_DATA)
//     .populate("toUserId",USER_SAFE_DATA)
//     console.log(connReq);
// res.json({data:connReq})}
//     catch(err){
//         res.send("err"+err)
//     }
// })

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
     const connReq=await connReqModel.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId",USER_SAFE_DATA)
    .populate("toUserId",USER_SAFE_DATA)
    console.log(connReq);
    if (connReq) {
      return res.status(200).json({
        connReq,
      });
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});



// userRouter.get("/user/connected",userAuth,async (req,res)=>{
//     try{

//         const loggedInUser=req.user
//         const connReq=await connReqModel.find({
//             $or:[
//              {   fromUserId: loggedInUser._id, status:"accepted"},
//               {  toUserId:loggedInUser._id,status:"accepted"}
//             ]
         
//         }).populate("fromUserId",USER_SAFE_DATA)
//         .populate("toUserId",USER_SAFE_DATA)

// const data=connReq.map((row)=>{
//     console.log("row");
//     if(row.fromUserId.toString()===loggedInUser.toString()){
       
// return row.toUserId
//     }
//     return row.fromUserId
// })


//         res.json({
//             data
//         })
//     }catch(err){
//         res.status(400).send("ERROR"+err)
//     }
// })


userRouter.get("/user/connected", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();

    const connections = await connReqModel.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" }
      ]
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

    // Only return the user who is NOT the logged-in user
    const data = connections.map(conn => {
      const fromId = conn.fromUserId._id.toString();
      const toId = conn.toUserId._id.toString();

      return fromId === loggedInUserId ? conn.toUserId : conn.fromUserId;
    });

    // Remove duplicates if necessary
    const seen = new Set();
    const uniqueData = data.filter(user => {
      const id = user._id.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    res.json({ data: uniqueData });
  } catch (err) {
    console.error("Connection fetch error:", err);
    res.status(500).json({ error: "Failed to fetch connections" });
  }
});


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
}).select()
// .skip(skip).limit(limit)

console.log(user);
res.json({data:user,
    connreq:connReq
})

}catch(err){
res.status(400).send("error"+err)
}


})

module.exports =userRouter
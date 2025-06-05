const express=require('express')
const RequestRoute=express.Router()
const {userAuth}=require('../auth')
// const connReq =require('../model/connectionReqSchema')
const {connReqModel}= require('../model/connectionReqSchema')
const {userSchema,Usermodel }= require('../model/user');



// RequestRoute.post('/connectionReq/send/:status/:toUserId',userAuth,async (req,res)=>{
//     const fromUserId=req.user._id
//     const toUserId=req.params.toUserId
//     const status=req.params.status
// try{
//     const allowedStatus=["ignored","interested"]
//     if(!allowedStatus.includes(status)){
// return res.status(400).json({msg:"invalid status type"+status})
//     }


// console.log("..");
//     const connReq = new connReqModel({
//         fromUserId:fromUserId,
//         toUserId:toUserId,
//         status:status
//     });

// console.log(connReq);
//     // const existingReq=await connReqModel.findOne({
//     //     $or:[
//     //         {fromUserId,toUserId},
//     //         {fromUserId:toUserId,toUserId:fromUserId}
//     //     ]
//     // })
//     // if(existingReq){
//     //     return res.status(400).send("user already exists ...")
//     // }
//     // const User=await Usermodel.findById(toUserId)
//     // if(User){
//     //     return res.send(User)
//     // }
//     const data=await connReq.save()
//     console.log("data"+data)
//     res.send({
//         msg:"connection req sent succesfully",
//         data
//     })}catch(err){
//         res.status(400).send("somme issue"+err)
//     }
// })



// RequestRoute.post("/connectionReq/review/:status/:reqId",userAuth,async(req,res)=>{
// try{
//     //login
//     //status
//     const loggedInUser=req.user
//     const {status,reqId}=req.params
// console.log("reqId.."+reqId);
//     const allowedStatus=['accepted','rejected']
//     if(!allowedStatus.includes(status))
//         return res.status(400).send("status problem...."+status)
//     console.log("reqId"+reqId,"log"+loggedInUser._id,"stat"+status); 
//     const connReq=await connReqModel.findOne({
//         _id:reqId,
//         toUserId:loggedInUser._id,
//         status:"interested"
//     })
// console.log("connreq"+connReq);
// if(!connReq)
//     return res.status(400).send("cannot found connection req....")
// connReq.status=status
// res.json({
//     msg:"connection req"+status,
//     data:data
// })
// }catch(err){
//     res.status(400).send("err"+err)
// }
// })

RequestRoute.post('/connectionReq/send/:status/:toUserId', userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    try {
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ msg: "Invalid status type: " + status });
        }

        // Prevent sending request to self
        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({ error: "Cannot send request to yourself" });
        }

        // Check for existing request in either direction
        // const existingReq = await connReqModel.findOne({
        //     $or: [
        //         { fromUserId, toUserId },
        //         { fromUserId: toUserId, toUserId: fromUserId }
        //     ]
        // });

        // if (existingReq) {
        //     return res.status(400).json({ msg: "Connection request already exists" });
        // }

        const connReq = new connReqModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connReq.save();
        res.send({
            msg: "Connection request sent successfully",
            data
        });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

RequestRoute.post("/connectionReq/review/:status/:reqId", userAuth, async (req, res) => {
    try {
        // Extract logged-in user and parameters
        const loggedInUser = req.user;
        const { status, reqId } = req.params;

        // Log the incoming parameters for debugging
        console.log("Request Parameters:", req.params);
        console.log("Logged-in User:", loggedInUser);

        // Validate the status
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status: " + status);
        }

        // Log the query values before searching the database
        console.log("Querying for connectionReq with _id:", reqId);
        console.log("Logged-in user's _id:", loggedInUser._id);
        console.log("Looking for status 'interested'");

        // Find the connection request based on reqId, toUserId, and status
        const connReq = await connReqModel.findOne({
            _id: reqId,                      // match by connection request ID
            toUserId: loggedInUser._id,      // match by logged-in user's _id (toUserId)
            status: "interested"             // only match those with status "interested"
        });

        // Log the result for debugging
        console.log("Connection Request Found:", connReq);

        if (!connReq) {
            return res.status(400).send("Cannot find connection request with the given conditions.");
        }

        // Update the status of the connection request
        connReq.status = status;

        // Save the updated connection request
        const updatedConnReq = await connReq.save();

        // Respond with the updated data
        res.json({
            msg: `Connection request status updated to ${status}`,
            data: updatedConnReq
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(400).send("Error: " + err.message);
    }
});

module.exports=RequestRoute
const express=require('express')
const mongoose=require('mongoose')

const {ValidateProfileEditData,ValidateProfilepasswordData}=require('../utils/validate')
const profileRoute=express.Router()
const {userAuth}=require('../auth')
const {userSchema,Usermodel }= require('../model/user');

profileRoute.get("/profile",userAuth,async (req,res)=>{
  
        res.send(req.user)
    })


profileRoute.patch("/updateuser/:userId",async (req,res)=>{
        try{
            const ALLOWED_UPDATES=["photoUrl","skills","lastName","age","gender","about"]
            
            const userId=req.params.userId
            const emailId=req.body.email
            const data=req.body
            console.log("....1");
            if(data?.skills?.length>10){
                throw new Error("limit exceeeded for skills")
            }
            if(!mongoose.Types.ObjectId.isValid(userId)){
              console.log("inc");
   return res.status(400).send("Invalid userId");

}else console.log("valid");


            console.log("....25");
            const isUpdateAllowed=Object.keys(data).every(k=>  ALLOWED_UPDATES.includes(k))
            console.log(isUpdateAllowed)
            console.log("....2");
            if(!isUpdateAllowed){
     throw new Error("update not allowed")
            }
            console.log("....5");
            const updateduser=await Usermodel.findByIdAndUpdate(userId,data,
                {
                returnDocument:"after",
                runValidators:true
            })
            console.log(updateduser);
            res.json(updateduser)

    console.log("....13");
        }
        catch(err){
            res.status(400).send("something went wrong"+err)
        }
    })

profileRoute.delete("/deluser",async(req,res)=>{
        try{
    
        const userId= req.body.userId
        console.log(userId);
        const deluser=await Usermodel.findByIdAndDelete(userId)
        console.log(deluser);
        res.send("user deleted succesfully")
    
        }
        catch(err){
            res.status(400).send("something went wrong")
        }
    })
 profileRoute.get("/get",async (req,res)=>{
        const userEmail=req.body.email
        const surName=req.body.lastName
        try{
     const user = await Usermodel.findOne({
        // email:userEmail
        lastName:surName
     })
     if(user.length===0){
        res.status(404).send("user not found")
     }
     else{
     console.log(user);
     res.send(user)}
        }
        catch(err){
            res.status(404).send("something went wrong")
        }
    })
    
    
 profileRoute.get("/feed",userAuth,async (req,res)=>{
      try{ const users=await Usermodel.find({})
        console.log(users);
        res.send(users)}
        catch(err){
            res.send("something went wrong")}
       
    })

// profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
//   try {
//     // Validate incoming fields
//     if (!ValidateProfileEditData(req)) {
//       throw new Error("Not allowed to edit");
//     }

//     const loggedInUser = req.user;
//     console.log("Logged in user:", loggedInUser);

//     // Update only allowed fields
//     Object.keys(req.body).forEach((key) => {
//       loggedInUser[key] = req.body[key];
//     });

//     // Save changes to DB
//     await loggedInUser.save();

//     res.json({
//       msg: `${loggedInUser.firstName}, your profile was updated successfully`,
//       data: loggedInUser,
//     });
//   } catch (err) {
//     res.status(400).send({ error: err.message });
//   }
// });
profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    console.log("REQ BODY", req.body);
    console.log("REQ USER", req.user);

    Object.keys(req.body).forEach((key) => {
      req.user[key] = req.body[key];
    });

    await req.user.save();

    res.json({
      msg: `${req.user.firstName}, your profile was updated successfully`,
      data: req.user,
    });
  } catch (err) {
    console.log("Backend error:", err.message);
    res.status(400).send({ error: err.message });
  }
});


profileRoute.patch("/profile/password",userAuth,async(req,res)=>{
    try{if(! ValidateProfilepasswordData(req)){
        throw new Error("not allowed to edit")
        
      }}
      catch(err){
        res.status(400).send(err)
      }
      const passUser=req.user
      passUser["password"]=req.body["password"]
      await passUser.save()
      res.json({msg:"updated password",
        data:passUser
      })


})

module.exports=profileRoute
const jwt=require("jsonwebtoken")
const {userSchema,Usermodel }= require('./model/user');

const userAuth=async (req,res,next)=>{
  try{ 
     const cookies=req.cookies
    const {token}=cookies

    const decodedMsg=await jwt.verify(token,"DEV@TINDER$790")
   console.log(decodedMsg);
   const {_id}=decodedMsg
   console.log("logged user:"+_id);
   const user =await Usermodel.findById(_id)
     if(!user){
        throw new Error("user is not exist in db")
     }
     req.user=user
 next()
}
 catch(err){
    res.status(400).send("error:: "+err)
 }
}

module.exports={userAuth,}
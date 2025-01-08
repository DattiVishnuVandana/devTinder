const express=require('express')
const app=express()
const connectDB=require("../config/database");
const mongoose= require('mongoose');
const userSchema = require('./model/user');

app.use(express.json())

app.get("/get",async (req,res)=>{
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


app.get("/feed",async (req,res)=>{
  try{ const users=await Usermodel.find({})
    console.log(users);
    res.send(users)}
    catch(err){
        res.send("something went wrong")
    }
})
app.post('/signup',async (req,res)=>{
    console.log(req.body);
const userObj=req.body
const user=new Usermodel(userObj)
 try{
await user.save()

res.send("user succesfully added")
}
catch(err){
    res.status(400).send("error occured"+err)
}
}
)
app.delete("/deluser",async(req,res)=>{
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

app.patch("/updateuser/:userId",async (req,res)=>{
    try{
        const ALLOWED_UPDATES=["photoUrl","skills","lastName","age","gender","about"]
        
        const userId=req.params.userId
        const emailId=req.body.email
        const data=req.body
        if(data?.skills.length>10){
            throw new Error("limit exceeeded for skills")
        }
        const isUpdateAllowed=Object.keys(data).every(k=>  ALLOWED_UPDATES.includes(k))
        console.log(isUpdateAllowed)
        if(!isUpdateAllowed){
 throw new Error("update not allowed")
        }
        // const updateduser=await Usermodel.findOneAndUpdate({email:emailId},data,
        const updateduser=await Usermodel.findByIdAndUpdate(userId,data,
            {
            returnDocument:"after",
            runValidators:true
        })
        console.log(updateduser);
        res.send("user updated succesfully")

    }
    catch(err){
        res.status(400).send("something went wrong"+err)
    }
})
connectDB().then(()=>{
    console.log("connection succesfully established");
    app.listen(7777,()=>{
        console.log("server is listening on 7777");
    })
})
.catch(()=>{
    console.log("database cannot be established");
})

const Usermodel=mongoose.model('Users',userSchema)
module.exports=Usermodel

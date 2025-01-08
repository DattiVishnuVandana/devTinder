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
    res.status(400).send("error occured")
}
}
)



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

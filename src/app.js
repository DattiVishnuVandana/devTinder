const express=require('express')
const app=express()
const connectDB=require("../config/database");
const mongoose= require('mongoose');
const userSchema = require('./model/user');
const ValidateSignUpData = require('./utils/validate');
const bcrypt=require('bcrypt')
const cookieParser=require('cookie-parser')
const jwt=require("jsonwebtoken")

app.use(express.json())
app.use(cookieParser())

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
        res.send("something went wrong")}
   
})

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate the input data first
    try {
        ValidateSignUpData(req); // This will throw an error if validation fails
        console.log("Validation passed");

        // Hash the password after validation
        const pswdhashed = await bcrypt.hash(password, 10);

        // Create the user object
        const user = new Usermodel({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password: pswdhashed
        });

        // Save the user to the database
        await user.save();

        res.send("User successfully added");
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).send("Error occurred: " + err.message);
    }
});

app.post("/login",async (req,res)=>{
    try{
const {email,password}=req.body
const user =await Usermodel.findOne({email:email})
// console.log(user);
if(!user){
    throw new Error("email is not in db")
}
const isPasswordValid=await bcrypt.compare(password,user.password)
if(isPasswordValid){
    const token=await jwt.sign({_id:user._id},"DEV@TINDER$790")
console.log(token);


    res.cookie("token",token)

    res.send("login succesfull...|||")

     
}
else{
   
    throw new Error("password is incorrecct...||")
}
    }
    catch(err){
       res.status(400).send("err"+err)
    }
})

app.get("/profile",async (req,res)=>{
    const cookies=await req.cookies
    console.log(cookies);
    const {token}=cookies
    const decodedMsg=await jwt.verify(token,"DEV@TINDER$790")
console.log(decodedMsg);
const {_id}=decodedMsg
console.log("logged user:"+_id);
const user =await Usermodel.findById(_id)
    res.send(user)
})

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

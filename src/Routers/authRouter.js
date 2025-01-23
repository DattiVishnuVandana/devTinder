const express=require('express')
const authRouter=express.Router()
const ValidateSignUpData = require('../utils/validate');
const bcrypt=require('bcrypt')
const {userSchema,Usermodel }= require('../model/user');



authRouter.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate the input data first
    try {
        // ValidateSignUpData(req); // This will throw an error if validation fails
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


authRouter.post("/login",async (req,res)=>{
    try{
const {email,password}=req.body
const user =await Usermodel.findOne({email:email})
// console.log(user);
if(!user){
    throw new Error("email is not in db")
}
const isPasswordValid=await  user.validatePassword(password)
if(isPasswordValid){
    const token=await user.getJWT()
console.log(token);


    res.cookie("token",token,{expires:new Date(Date.now()+7*3600000)})

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

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())

    })
    res.send("log out success")
})

module.exports=authRouter



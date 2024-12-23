
const express=require("express") ;      

const {adminAuth,userAuth}=require("./auth") ;
                                                                                               
const app=express()
app.use("/admin",adminAuth)
app.use("/admin/getData",(req,res)=>{
    res.send("send data")
})
app.use("/user/login",(req,res,next)=>{
    console.log("1st one");
    res.send("user is authenticated login")
    // next()
})

app.use("/user/data",userAuth,(req,res,next)=>{
    console.log("2nd one");
    res.send("user is authenticated")
})

app.use("/admin/delete",(req,res)=>{
    res.send("deleted data")
})
app.listen(7777,()=>{
    console.log("server is succesfully running in port 7777..");
})


// console.log("1 st time creating server...");
const express=require("express"                                                                                                                   );
const app=express()

app.use("/test",(req,res)=>{
    res.send("hello from server...")
})
app.use("/hello",(req,res)=>{
    res.send("hii from server...")
})

app.listen(7777,()=>{
    console.log("server is succesfully running in port 7777..");
})
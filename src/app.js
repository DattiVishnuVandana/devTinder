
const express=require("express") ;      
const app=express()

app.use("/user/login",(req,res)=>{
    try{
    throw new Error("rthg");
    res.send("done")
    }catch(err){
        res.status(500).send("something wrong in  u r code")
    }
})
// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("something went wrong...")
//     }
// })

app.listen(7777,()=>{
    console.log("server is succesfully running in port 7777..");
})


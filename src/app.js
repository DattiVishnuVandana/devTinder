// console.log("1 st time creating server...");
const express=require("express"                                                                                                                   );
const app=express()

app.use("/",(req,res,next)=>{
console.log("passing");
// res.send("0")
next()
console.log("done 0");
})
app.get("/user",[[(req,res,next)=>{

    console.log("route handler1");
    // res.send("1")
    next()
    console.log("termination1");
    
},(req,res,next)=>{

    console.log("route handler2");
    // res.send("1")
    next()
    console.log("termination2");
    
}],
(req,res,next)=>{

    console.log("route handler3");
    res.send("3")
    // next()
    console.log("termination3");
    
}])
app.listen(7777,()=>{
    console.log("server is succesfully running in port 7777..");
})
// console.log("1 st time creating server...");
const express=require("express"                                                                                                                   );
const app=express()

app.get("/user",(req,res)=>{
    res.send({firstname:"vandana",lastname:"datti"})
})
app.post("/user",(req,res)=>{
    res.send("data succesfully posted")
})

app.delete("/user",(req,res)=>{
    res.send("deleted succesfully...")
})

app.use("/user",(req,res)=>{
    res.send("succesfully done api ..handles all calls")
})

app.listen(7777,()=>{
    console.log("server is succesfully running in port 7777..");
})
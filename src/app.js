const express=require('express')
const app=express()
const connectDB=require("../config/database");
const mongoose= require('mongoose');
const {userSchema }= require('./model/user');

const cookieParser=require('cookie-parser')
const cors=require('cors')


app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())



const reqRoute=require('./Routers/Request')
const profile=require('./Routers/profileRoute')
const authRouter=require('./Routers/authRouter')
const userRouter=require('./Routers/user')

app.use("/",authRouter)
app.use("/",profile)
 app.use("/",reqRoute)
 app.use("/",userRouter)



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

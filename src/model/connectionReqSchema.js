const mongoose=require('mongoose')
const {Usermodel}=require('../model/user')
const connectionReqSchema=new mongoose.Schema({
fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:Usermodel,
    required:true
},
toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:Usermodel

},
status:{
    type:String,
    enum:{
values:["ignored","interested","accepted","rejected"],
msg:"{VALUE} is incorrect status"
    }

}

},{
    timestamp:true
})

connectionReqSchema.pre("save",function(next){
    const connReq=this
    if(connReq.fromUserId.equals(connReq.toUserId)){
        throw new Error("cant send connreq to u r self")
    }
    next()
})
const connReqModel=new mongoose.model("connectionReq",connectionReqSchema)
module.exports={connReqModel}
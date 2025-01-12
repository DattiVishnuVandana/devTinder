const mongoose=require('mongoose')
const connectionReqSchema=new mongoose.Schema({
fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
},
toUserId:{
    type:mongoose.Schema.Types.ObjectId
},
status:{
    type:String,
    enum:{
values:["ignore","interested","accepted","rejected"],
msg:"{VALUE} is incorrect status"
    }

}

},{
    timestamp:true
})

connectionReqSchema.pre("save",function(){
    const connReq=this
    if(connReq.fromUserId.equals(connReq.toUserId)){
        throw new Error("cant send connreq to u r self")
    }
    next()
})
const connReqModel=new mongoose.model("connectionReq",connectionReqSchema)
module.exports={connReqModel}
const mongoose=require('mongoose')

const userSchema=mongoose.Schema(
    {
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        age:{
            type:Number
        },
        gender:{
            type:String
        },
        email:{
            type:String
        },
        password:{
            type:String
        }

    }
)
module.exports=userSchema
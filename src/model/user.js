const mongoose=require('mongoose')
const validator=require('validator')
const userSchema=mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            minlength:4
        },
        lastName:{
            type:String
        },
        age:{
            type:Number
        },
        gender:{
            type:String,
            validate(value){
                if (!['male', 'female', 'others'].includes(value)) {
                    throw new Error("Gender is not valid");
                }
            }
            
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            maxlength:60,
            
        },
        password:{
            type:String,
            required:true
        },
        photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"this is an about section ..you can add or update u r bio "
    },
    skills:{
        type:[String]
    }

    },{timestamps:true}
)
module.exports=userSchema
const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
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
            type:Number,
            default:" "
        },
        gender:{
            type:String,
            // default:" ",
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
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("email is not vallid")
                }
            }
        },
        password:{
            type:String,
            required:true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("please make sure u r password should be strong")
                }
            }
        },
        photoUrl:{
        type:String,
        default:"https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-18.jpg",
       
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("please upload correct link")
            }
        }
        
    },
    about:{
        type:String,
        default:" "
    },
    skills:{
        type:[String]
    }

    },{timestamps:true}
)
userSchema.methods.getJWT=async function(){
    const user=this;
   const token= jwt.sign({_id:user._id},"DEV@TINDER$790",{expiresIn:"7d"})
   return token
}
userSchema.methods.validatePassword=async function(InputPass){

    const user=this
    const passwordhash=user.password
    const isPassValid=await bcrypt.compare(InputPass,passwordhash)
    return isPassValid
}

const Usermodel=mongoose.model('Users', userSchema);
module.exports =  {Usermodel,userSchema}
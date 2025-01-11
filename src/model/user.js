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
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("please upload correct link")
            }
        }
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
const Usermodel = mongoose.model('Users', userSchema);

module.exports = {userSchema,Usermodel};
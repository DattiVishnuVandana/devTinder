const mongoose=require('mongoose')

const connectDB=async ()=>{
    await  mongoose.connect(
         "mongodb+srv://vandana_datti:4wYPu4fAc25Zgpt6@codecrafters.zbfan.mongodb.net/devTinder"
        
    )
}
module.exports=connectDB
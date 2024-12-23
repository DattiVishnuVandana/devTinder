const adminAuth=(req,res,next)=>{
    const token="xyz"
    const isAuthent= token === "xyz"
    if(!isAuthent)
        res.status(401).send("not authenticated")
    else
      next()
}
const userAuth=(req,res,next)=>{
    const token="abc"
    const isAuthent=token==="abc"
    if(!isAuthent)
        res.status(401).send("user is not authenticated")
    else
    next()
}
module.exports ={adminAuth,userAuth}
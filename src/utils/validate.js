const validator = require('validator');

const ValidateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid..!!!");
    } else if (!(4 < firstName.length && firstName.length < 50)) {
        throw new Error("Name length should be between 4-50 characters");
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password...!!!");
    }
};

const ValidateProfileEditData=(req)=>{
    const allowedEdit=["firstName","lastName","age","gender","skills","about","photoUrl"]
  const isAllow=Object.keys(req.body).every(k=>allowedEdit.includes(k))
return isAllow
}

const ValidateProfilepasswordData=(req)=>{
    const allowedEdit=["password"]
    const isAllow=Object.keys(req.body).every(k=>allowedEdit.includes(k))
  return isAllow
  
}
module.exports ={ ValidateSignUpData,ValidateProfileEditData,ValidateProfilepasswordData}

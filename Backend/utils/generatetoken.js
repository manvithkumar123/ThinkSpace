const jwt = require('jsonwebtoken');

const generatetoken=(newuser)=>{
    return jwt.sign({email:newuser.email,id:newuser._id,role:newuser.role},process.env.JWT_KEY)
}
module.exports=generatetoken;
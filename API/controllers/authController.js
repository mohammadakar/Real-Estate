const {User}=require("../models/User");
const bcrypt=require("bcryptjs")
const asyncHandler=require("express-async-handler")

module.exports.signUp=asyncHandler(async(req,res)=>{
    const {username,email,password} =req.body
    const hashedPassword = bcrypt.hashSync(password,10)
    const user=await new User({username,email,password:hashedPassword});
    await user.save();
    res.status(201).json({message:"user created successfully"})
    res.status(500).json(error.message)
    
})
const {User}=require("../models/User");
const bcrypt=require("bcryptjs")

module.exports.signUp=async(req,res)=>{
    const {username,email,password} =req.body
    const hashedPassword = bcrypt.hashSync(password,10)
    const user=await new User({username,email,password:hashedPassword});
    try {
        await user.save();
        res.status(201).json({message:"user created successfully"})
    } catch (error) {
        res.status(500).json(error.message)
    }
}
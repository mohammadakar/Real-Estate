const {User}=require("../models/User");
const bcrypt=require("bcryptjs")
const asyncHandler=require("express-async-handler")
const jwt =require("jsonwebtoken")

module.exports.signUp=asyncHandler(async(req,res)=>{
    const {username,email,password} =req.body
    const hashedPassword = bcrypt.hashSync(password,10)
    const user=await new User({username,email,password:hashedPassword});
    await user.save();
    res.status(201).json({message:"user created successfully"})
    res.status(500).json(error.message)
    
})

module.exports.signIn = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return res.status(404).json({ message: "Not Found" });
        }

        const validPassword = bcrypt.compareSync(password, validUser.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Wrong credentials" });
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            .status(200).json(rest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const {User}=require("../models/User");
const bcrypt=require("bcryptjs")
const asyncHandler=require("express-async-handler")
const jwt =require("jsonwebtoken")

module.exports.signUp = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
});

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

module.exports.google = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
                .status(200).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
                .status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
});

module.exports.signOut=async (req,res,next)=>{
    try {
        res.clearCookie("access_token")
        res.status(200).json({message:"User has been logged out!"})
    } catch (error) {
        next(error)
    }
}
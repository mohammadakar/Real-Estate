const { User } = require("../models/User")
const errorHandler =require("../utils/error")
const bcrypt =require("bcryptjs")
module.exports.test=(req,res)=>{
    res.json({message:"Hello everybody"})
}

module.exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your account"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

module.exports.deleteUserCtrl = async (req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,"You can only delete your account"))
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie("access_token")
        res.status(200).json({message:"Your account has been deleted"})
    } catch (error) {
        next(error)
    }
}
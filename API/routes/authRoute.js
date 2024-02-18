const { signUp } = require("../controllers/authController");
const router=require("express").Router();

router.post("/signup",signUp)


module.exports=router;
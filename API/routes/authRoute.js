const { signUp, signIn } = require("../controllers/authController");
const router=require("express").Router();

router.post("/signup",signUp)
router.post("/signin",signIn)


module.exports=router;
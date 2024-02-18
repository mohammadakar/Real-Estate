const { test } = require("../controllers/userController");

const router = require("express").Router();

router.get("/test" , test)



module.exports=router;
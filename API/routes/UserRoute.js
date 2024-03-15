const { test, updateUser, deleteUserCtrl } = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyUser");

const router = require("express").Router();

router.get("/test" , test);
router.put("/update/:id",verifyToken,updateUser);
router.delete("/delete/:id",verifyToken,deleteUserCtrl);



module.exports=router;
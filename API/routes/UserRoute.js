const { test, updateUser, deleteUserCtrl, getUserListings } = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyUser");

const router = require("express").Router();

router.get("/test" , test);
router.put("/update/:id",verifyToken,updateUser);
router.delete("/delete/:id",verifyToken,deleteUserCtrl);
router.get("/listings/:id",verifyToken,getUserListings)



module.exports=router;
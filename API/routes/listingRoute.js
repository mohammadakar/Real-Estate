const { createListing } = require("../controllers/listingController");
const { verifyToken } = require("../utils/verifyUser");

const router=require("express").Router();


router.post('/create',verifyToken,createListing)


module.exports=router;
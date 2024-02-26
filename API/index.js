const express=require("express");
const mongoose=require("mongoose")
const dotenv=require("dotenv");
const cookie =require("cookie-parser")
dotenv.config();

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connected to DB");
})
.catch((error)=>{
    console.log(error);
});

const app=express();
app.use(express.json())
app.use(cookie())
app.use("/api/users" , require("./routes/UserRoute"))
app.use("/api/auth" , require("./routes/authRoute"))



app.listen(4000 , ()=>{
    console.log("server is running on port 4000")
})


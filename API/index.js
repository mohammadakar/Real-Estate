const express=require("express");
const mongoose=require("mongoose")
const dotenv=require("dotenv")
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

app.use("/api/users" , require("./routes/UserRoute"))

app.listen(4000 , ()=>{
    console.log("server is running on port 4000")
})


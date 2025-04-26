import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user_routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import mediaRoute from "./routes/media.route.js";
import courseRoute from "./routes/course.route.js"
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/CourseProgress.route.js";
dotenv.config({});
connectDB();
const app=express();
const PORT=process.env.PORT||3000;
//apis
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173", //front end url
    credentials:true
}));
//apis
app.use("/api/v1/user",userRoute);
//we create the ui of course creation in dashboard becoz only instructor create the course 
app.use("/api/v1/course",courseRoute);
//api create like this -> "http://localhost:8080/api/v1/user/register"
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.get("/api/v1/user/register", (req, res) => {
    res.json({ message: "This is a GET request for registration" });
  });

app.get("/home",(_,res)=>{
    res.status(200).json({
        success:true,
        message:"hello i am coming from backend"
    })
});

app.listen(PORT,()=>{
    console.log(`server started at port${PORT}`);
})

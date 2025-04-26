import { User } from "../models/user_models.js";
import  bcrypt  from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
export const register = async(req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }
    
    // Check if user already exists
    const user = await User.findOne({ email });
    if(user) {
      return res.status(400).json({
        success: false,
        message: "User already exists."
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with username set to email or name (depends on your preference)
    await User.create({
      name,
      email,
      username: email, // Use email as username
      password: hashedPassword
    });
    
    return res.status(201).json({
      success: true,
      message: "Account created successfully."
    });
  }
  catch(error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to register"
    });
  }
}
//For Login
export const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email||!password){
           return res.status(400).json({
               success:false,
               message:"All fields are required."
           })
        }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Incorrect email or password."
    })
}
const isPasswordMatch=await bcrypt.compare(password,user.password);
if(!isPasswordMatch){
    return res.status(400).json({
        success:false,
        message:"Incorrect password."
});
}
//generate Token ->check user login or not 
//use JWT Token by cookie if it expire need to login again
generateToken(res,user,`Welcome back${user.name}`);
 
} catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to register"
          })
      }
}
export default { register,login}; 
export const logout=async(_,res)=>{
  try{
    return res.status(200).cookie("token","",{maxAge:0}).json({
      message:"Logged out successfully.",
      success:true
    })
  }catch{
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Failed to Logout"
    })
  }
}
export const getUserProfile=async(req,res)=>{
  try {
    
    
    const userId=req.user?.id;
    const user=await User.findById(userId).select("-password").populate("enrolledCourses");
    if(!user){
      return res.status(404).json({
        message:"Profile not found",
        success:false
      })
    }
    return res.status(200).json({
      success:true,
      user
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Failed to Logout"})
  }
}
export const updateProfile=async(req,res)=>{
  try {
    const userId=req.user.id;
    const {name}=req.body;
    const profilePhoto=req.file;
    const user=await User.findById(userId);
    if(!user){
      return res.status(404).json({
        message:"User not found",
        success:false
      })
    }
    //extract public id of the old image from the url if it exists
    if(user.photoUrl){
      const publicId=user.photoUrl.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }
    //upload new photo
    const cloudResponse=await uploadMedia(profilePhoto.path);
    const photoUrl=cloudResponse.secure_url;
    const updatedData={name,photoUrl};
    const updatedUser=await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");
    return res.status(200).json({
      success:true,
      user:updatedUser,
      message:"Profile updated successfully."
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Failed to update"})
  }
}
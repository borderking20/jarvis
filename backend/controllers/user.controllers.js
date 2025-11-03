//import { response } from "express"
import cloud from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"
export const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found!"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"getCurrentUser error!"})
    }
}

export const updateAssistant = async(req,res)=>{
    try {
        const {assistantName, imageUrl} = req.body
        let assistantImage
        if(req.files){
            assistantImage = await cloud(req.file.path)
        }
        else{
            assistantImage = imageUrl
        }
        const user = await User.findByIdAndUpdate(req.userId,{assistantName
            ,assistantImage
        },{new : true}).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:"update assistant error!"})
    }
}

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    console.log("Received command:", command);

    if (!command) {
      return res.status(400).json({ response: "Command is missing" });
    }

    // ✅ Check if userId exists
    if (!req.userId) {
      console.log("No userId found in request");
      return res.status(401).json({ response: "Unauthorized user" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ response: "User not found" });
    }
    
    console.log("User found:", user.name);
    user.history.push(command)
    user.save()
    const result = await geminiResponse(command, user.name, user.assistantName);
    console.log("Gemini raw result:", result);

    // ✅ Handle invalid geminiResponse
    if (!result || typeof result !== "string") {
      return res.status(400).json({ response: "Invalid response from Gemini" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    console.log(gemResult)
    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`,
        });
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
      case "leetcode-open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res
          .status(400)
          .json({ response: "I did not understand that command." });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({ response: "ask assistant error" });
  }
};

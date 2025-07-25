import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";


const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @route   POST /
 * @desc    Handle chat requests to Gemini API
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

   
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    
    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

   
    res.status(200).json({ success: true, response: text });

  } catch (error) {
    console.error("Error in chat route:", error);
    res.status(500).json({ success: false, error: "Failed to get response from AI" });
  }
});

export default router;
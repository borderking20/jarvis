import axios from "axios";

const geminiResponse = async (command, userName, assistantName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    const prompt = `
      You are a virtual assistant named ${assistantName}, created by ${userName}.
      You are not Google. You behave like a voice-enabled assistant.

      Your task is to understand the user's natural language input and respond ONLY with a JSON object like this:

      {
        "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
                 "get-time" | "get-date" | "get-month" | "get-day" |
                 "calculator-open" | "instagram-open" | "facebook-open" |
                 "weather-show" | "leetcode-open",
        "userInput": "<original user input>",
        "response": "<a short spoken response>"
      }
      Type meanings:
      -"general": if it is a factual or informational question. and if anyone 
      asks you a questions whose answer you already know then put this into a
      general category and give a short polite answer.
      - "google-search": it means user wants you to search something on google.
      - "youtube-play": it means user wants you to play a direct video on youtube
      na ki search kro youtube pr.
      -"youtube-search" it means user wants you to search something on youtube.
      Important:
      - Respond only with the JSON object.
      - "userInput" should be the original sentence minus your name.
      - -If someone asks who created you, respond naturally with a short sentence like "<author name> created me" or "I was made by <author name>".-
      
      Now, user's input: "${command}"
    `;

    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.log("Invalid Gemini response:", response.data);
      return "Error: No text response from Gemini.";
    }

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Error: Gemini request failed.";
  }
};

export default geminiResponse;

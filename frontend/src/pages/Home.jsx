import { useContext, useRef, useState } from "react"
import { userDataContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { TiThMenu } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [listening, setListening] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const synth = window.speechSynthesis
  const [ham,setHam] = useState(false)
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logOut`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      console.log(error)
      setUserData(null)
      navigate("/signin")
    }
  }

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1
    isSpeakingRef.current = true
    setIsAISpeaking(true)
    utterance.onend = () => {
      isSpeakingRef.current = false
      setIsAISpeaking(false)
      if (callback) callback()
    }
    synth.speak(utterance)
  }

const stopAssistant = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop()
  }
  setListening(false)
  setIsUserSpeaking(false)

  // First speak the shutdown message, then deactivate the assistant
  speak("Assistant stopped. Press start assistant to activate me again.", () => {
    setIsActive(false)
  })
}

  const handleCommand = (data, restartListening) => {
    const { type, userInput, response } = data

    if (userInput.toLowerCase().includes("stop listening")) {
      stopAssistant()
      return
    }

    const cleanQuery = (input) =>
      input.replace(/search|on google|on youtube|in google|in youtube|please|play|open/gi, "").trim()

    if (userInput.toLowerCase().includes("log out") || userInput.toLowerCase().includes("logout")) {
      speak("Logging you out now. Goodbye!", async () => {
        await handleLogOut()
      })
      return
    }

    speak(response, restartListening)

    if (type === "google-search") {
      const query = encodeURIComponent(cleanQuery(userInput))
      window.open(`https://www.google.com/search?q=${query}`, "_blank")
    } else if (type === "calculator-open") {
      window.open("https://www.google.com/search?q=calculator", "_blank")
    } else if (type === "instagram-open") {
      window.open("https://www.instagram.com", "_blank")
    } else if (type === "facebook-open") {
      window.open("https://www.facebook.com", "_blank")
    } else if (type === "leetcode-open") {
      window.open("https://www.leetcode.com", "_blank")
    } else if (type === "weather-show") {
      window.open("https://www.google.com/search?q=weather", "_blank")
    } else if (type === "youtube-search") {
      const query = encodeURIComponent(cleanQuery(userInput))
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank")
    } else if (type === "youtube-play") {
      const query = encodeURIComponent(cleanQuery(userInput))
      window.open(`https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%3D%3D`, "_blank")
    }
  }

  const startAssistant = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = "en-US"
    recognitionRef.current = recognition

    const safeRecognition = () => {
      if (!isSpeakingRef.current) {
        try {
          recognition.start()
          console.log("Recognition started")
          setListening(true)
          setIsUserSpeaking(true)
        } catch (err) {
          if (err.name !== "InvalidStateError") console.log("Start error:", err)
        }
      }
    }

    recognition.onend = () => {
      console.log("Recognition ended")
      setListening(false)
      setIsUserSpeaking(false)
      if (isActive && !isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 800)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      setListening(false)
      setIsUserSpeaking(false)
      if (event.error !== "aborted" && isActive && !isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log("Heard:", transcript)

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        recognition.stop()
        const data = await getGeminiResponse(transcript)
        console.log(data)
        handleCommand(data, safeRecognition)
      }

      if (transcript.toLowerCase().includes("start assistant")) {
        if (!isActive) {
          setIsActive(true)
          speak(`Hello again! I am ${userData.assistantName}, ready to assist you.`, safeRecognition)
        }
      }
    }

    speak(`Voice assistant activated. Hello, I am ${userData.assistantName}. How can I help you today?`, safeRecognition)
    setIsActive(true)
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-[15px]">
      <TiThMenu className="lg:hidden text-white absolute top-[20px] right-[20px]
      w-[25px] h-[25px] overflow-hidden"onClick={()=>setHam(true)} />

     <div className={`lg:hidden absolute top-0 w-full h-full bg-[00000053] backdrop-blur-lg p-[20px]
     flex flex-col gap-[20px] items-start ${ham ? "translate-x-0": "translate-x-full"} transition-transform`}>
       <RxCross2  className="lg:hidden text-white absolute top-[20px] right-[20px]
      w-[25px] h-[25px]" onClick={()=>setHam(false)}/>
      <button
        className="lg:hidden min-w-[150px] h-[60px] text-black font-semibold text-[19px] bg-white rounded-full cursor-pointer"
        onClick={handleLogOut}
      >
        Log out
      </button>

      <button
        className="lg:hidden min-w-[150px] h-[60px]  text-black font-semibold text-[19px] bg-white rounded-full cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize
      </button>
      <div className="w-full h-[2px] bg-gray-400 lg:block"></div>
      <h1 className="text-white font-semibold text-[19px]">History</h1>
      <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate lg:block">
        {userData.history?.map((his)=>(
          <span className="text-gray-200 text-[18px] mt-[20px] lg:hidden">{his}</span>
        ))}
      </div>
     </div>

      <button
        className="absolute top-[20px] right-[20px] min-w-[150px] h-[60px] hidden lg:block text-black font-semibold text-[19px] bg-white rounded-full cursor-pointer"
        onClick={handleLogOut}
      >
        Log out
      </button>

      <button
        className="absolute top-[100px] right-[20px] min-w-[150px] h-[60px] hidden lg:block text-black font-semibold text-[19px] bg-white rounded-full cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        {isUserSpeaking ? (
          <img src={userImg} alt="User speaking" className="h-full object-cover" />
        ) : isAISpeaking ? (
          <img src={aiImg} alt="AI speaking" className="h-full object-cover" />
        ) : (
          <img src={userData?.assistantImage} alt="" className="h-full object-cover" />
        )}
      </div>

      <h1 className="text-white text-[18px] font-semibold">{`Hello, I am ${userData?.assistantName}`}</h1>

      {!isActive && (
        <button
          className="bg-white text-black font-semibold px-6 py-3 rounded-full mt-6 hover:bg-gray-200 transition"
          onClick={startAssistant}
        >
          Start Assistant
        </button>
      )}

      {isActive && (
        <p className="text-gray-300 mt-4">
          {listening ? "🎙️ Listening..." : "🤖 Processing..."}
        </p>
      )}
    </div>
  )
}

export default Home

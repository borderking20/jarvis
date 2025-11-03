import { useContext, useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu"
import bg from "../assets/authBg.png"
import { useNavigate } from "react-router-dom"
import { userDataContext } from '../context/UserContext'
import axios from "axios"
import toast from "react-hot-toast"

function SignIn() {
  const { serverUrl,userData,setUserData } = useContext(userDataContext)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      )
      setUserData(result.data)
      setLoading(false)
      toast.success("Logged in successfully 🎉")
      console.log(result.data)

      // navigate to home or dashboard after login
      navigate("/")
    } catch (error) {
      setUserData(null)
      setLoading(false)
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Network error, please try again")
      }
    }
  }

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px]
        bg-[#00000069] backdrop-blur shadow-lg shadow-blue-950
        flex flex-col items-center justify-center gap-[20px] px-[20px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Login To <span className="text-blue-400">J.A.R.V.I.S</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full h-[60px] outline-none 
          border-2 border-white bg-transparent text-white
          placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div
          className="w-full h-[60px] outline-none 
          border-2 border-white bg-transparent text-white rounded-full text-[18px] relative"
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-full rounded-full 
            outline-none bg-transparent px-[20px] py-[10px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <LuEye
              className="absolute top-[18px] right-[20px] 
              w-[25px] h-[25px] text-[white] cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <LuEyeClosed
              className="absolute top-[18px] right-[20px] 
              w-[25px] h-[25px] text-[white] cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold text-[19px] bg-white rounded-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Log In"}
        </button>

        <p className="text-white text-[20px]">
          Want to create a new account?{" "}
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  )
}

export default SignIn

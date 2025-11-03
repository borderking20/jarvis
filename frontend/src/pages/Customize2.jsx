import { useContext } from 'react'
import { useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { RiArrowGoBackFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
    const [Ainame,setAiName] = useState(userData ?.Ainame || "")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const handleUpdateAssistant = async()=>{
      setLoading(true)
      try {
        let formData = new FormData()
        formData.append("assistantName", Ainame)
        if(backendImage){
          formData.append("assistantImage", backendImage)
        }
        else{
          formData.append("imageUrl",selectedImage)
        }
        const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
        setLoading(false)
        console.log(result.data)
        setUserData(result.data)
        navigate("/")
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t
    from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>

      <RiArrowGoBackFill className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'
       onClick={()=>navigate("/customize")}/>
      
      <h1 className='text-white mb-[30px] text-[30px] text-center'>
        Don't like Jarvis ? Enter your 
        <span className='text-blue-200'> A.I name</span></h1>
        
        <input type="text" placeholder='ex : friday ' className='w-full
        max-w-[600px] outline-none border-2 border-white bg-transparent text-white
        placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
        required onChange={(e)=>setAiName(e.target.value)} value={Ainame}/>
        
        {Ainame && <button className='min-w-[150px] h-[60px] mt-[30px]
     text-black font-semibold text-[19px] bg-white rounded-full cursor-pointer' 
     disabled = {loading}
     onClick={()=>{
      handleUpdateAssistant() ,navigate("/")
     }}>{!loading?" ready to talk ?" : "Loading..."}</button>}
        
    </div>
  )
}

export default Customize2

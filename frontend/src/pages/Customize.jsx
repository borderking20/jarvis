import { useRef } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import authBg from "../assets/authBg.png"
import { FaCloudUploadAlt } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useState } from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function Customize(){
  const {serverUrl,userData,setUserData,
      backendImage,setBackendImage,frontendImage,
      setFrontendImage,selectedImage,setSelectedImage} = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef()
  const handleImage=(e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t
    from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]'>
      
      <RiArrowGoBackFill className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'
             onClick={()=>navigate("/")}/>

      <h1 className='text-white mb-[30px] text-[30px] text-center'>Select your <span className='text-blue-200'>A.I image</span></h1>
      <div className='w-full max-w-[900px] flex justify-center
      items-center flex-wrap gap-[15px]'>
        <Card image={image1}/>
        <Card image={authBg}/>
        <Card image={image2}/>
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]  bg-[#030326] border-2 
    border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl
    hover:shadow-blue-950 cursor-pointer hover:border-3 hover:border-white flex items-center
    justify-center ${selectedImage=="input" ? 
        "border-3 border-white shadow-2xl shadow-blue-950" : null}`}onClick={()=>{inputImage.current.click()
      setSelectedImage("input")
    }}>
{!frontendImage && <FaCloudUploadAlt className='text-white w-[25px] h-[25px] ' />}
{frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
    </div>
    <input type="file" accept='image/*'ref={inputImage} hidden
    onChange={handleImage}/>
      </div>
       {selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px]
     text-black font-semibold text-[19px] bg-white rounded-full cursor-pointer' onClick={()=>navigate("/customize2")}>Next</button>}
    </div>
  )
}

export default Customize
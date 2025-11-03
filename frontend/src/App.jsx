import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import { Toaster } from 'react-hot-toast'
import Customize from './pages/Customize'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import Customize2 from './pages/Customize2'
import Home from './pages/Home'
function App()  {
  const {userData,setUserData} = useContext(userDataContext)
  return (
    <>
      <Routes>
        <Route path='/' element={(userData?.assistantImage && userData.assistantName) ?<Home/>:<Navigate to={"/customize"}/>} />
        <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/> } />
        <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={"/"}/>} />
        <Route path='/customize' element={userData ? <Customize/> :  <Navigate to={"/signin"}/>} />
        <Route path='/customize2' element={userData ? <Customize2/> :  <Navigate to={"/signin"}/>} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App

import { Route, Routes } from "react-router-dom"
import "./index.css"
import LoginForm from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import AddBio from "./pages/AddBio"
import AddProfilePic from "./pages/AddProfilePic"
import Feed from "./pages/Feed"
import Explore from "./pages/Explore"
import Otp from "./pages/Otp"


const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/users/profile/:id" element={<Profile />} />
      <Route path ="/addbio" element = {<AddBio />} />
      <Route path ="/addProfilePic" element = {<AddProfilePic />} />
      <Route path="/feed" element = {<Feed />} />
      <Route path="/explore" element = {<Explore />} />
      <Route path="/verification" element = {<Otp />} />
    </Routes>

    </>
  )
}

export default App
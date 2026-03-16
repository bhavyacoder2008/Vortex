import axios from "axios";
import { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import FeedPosts from "./FeedPosts";


const Feed = () => {
    const [postArray , setPostArray] = useState([]);
    const [suggestions , setSuggestions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const getPosts = async ()=> {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/feed` , {withCredentials : true});
            console.log(res.data)
            setPostArray(res.data.posts)
        }
        const suggestions = async () => {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/feedUsers` , {} , {withCredentials : true});
            console.log(res.data)
            setSuggestions(res.data)
        }
        getPosts()
        suggestions();
    },[])
  return (
    <>
        <NavBar />
        <div className="sm:text-3xl text-2xl p-4 text-white">Suggestions</div>
        <div className="flex overflow-auto gap-4 scroll-smooth px-2 py-3 sm:mb-20 mb-10">
  {
    suggestions.map((val, i) => {
      return (
        <div className="max-w-[100px] max-h-[100px] sm:max-w-[200px] w-fit shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 text-white max-h-50 p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
         onClick={() => navigate(`/users/profile/${val._id}`)}
        >
          <div className="rounded-3xl w-[80%] h-[50%] flex justify-center">
            <img src={val.profilePic} alt="" className="w-full h-full overflow-hidden rounded-4xl ring-2 ring-white/40" />
          </div>
          <div className="sm:text-lg text-xs sm:mt-4 mt-2 text-[#ebffcb]">@{val.username}</div>
          <div className="text-xs text-white/70 hover:text-white transition-colors sm:mt-4 mt-1 "
            
          >VISIT</div>
        </div>
      )
    })
  }
</div>
        <FeedPosts feedPosts={postArray}/>

    </>
  )
}

export default Feed
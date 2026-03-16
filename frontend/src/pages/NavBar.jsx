import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const [loggedin, setLoggedIn] = useState("");
  const [isOpen , setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout`,
        {},
        { withCredentials: true },
      );
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getLoggedinUser = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/feed`, {
        withCredentials: true,
      });
      console.log(res.data.loggedInuser);
      setLoggedIn(res.data.loggedInuser);
    };
    getLoggedinUser();
  }, []);

  return (
    <>
      {/* navbar for desktop*/}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-950/70 backdrop-blur-md z-20 shadow-sm shadow-indigo-500/5">
        <div className="flex items-center">
          <span className="font-extrabold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400 tracking-tight text-sm sm:text-xl">
            Vortex
          </span>
        </div>
        <div className="hidden gap-4 sm:gap-12 sm:flex">
          <Link
            to={"/feed"}
            className="text-[#7fff5c] hover:text-white transition-all duration-300 text-sm sm:text-xl font-semibold px-4 py-2 rounded-xl hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10"
          >
            Home
          </Link>
          <Link
            to={`/users/profile/${loggedin}`}
            className="text-[#7fff5c] hover:text-white transition-all sm:text-xl duration-300 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10"
          >
            Profile
          </Link>
          <Link
            to={"/explore"}
            className="text-[#7fff5c] hover:text-white transition-all duration-300 text-sm font-semibold sm:text-xl px-4 py-2 rounded-xl hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10"
          >
            Explore
          </Link>
        </div>
        <button
          className="text-slate-400 hover:text-white transition-all duration-300 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 hidden sm:block"
          onClick={logOut}
        >
          Log out
        </button>
        {/* hamburger menu (last thing (hopefully)) */}
        <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 p-2"
        >
          {isOpen ? <div className="text-white text-2xl">X</div>: (<><span
            className={`block w-6 h-0.5 bg-white`}
          />
          <span
            className={`block w-6 h-0.5 bg-white `}
          />
          <span
            className={`block w-6 h-0.5 bg-white `}
          /></>)}
        </button>


        {isOpen ? (
          <div className="flex flex-col gap-4 p-6 bg-[#0d1117] border border-indigo-500/20 rounded-2xl animate-ham z-50 absolute right-0 top-14 text-white">
            <Link to = {"/feed"}>Home</Link>
            <Link to={`/users/profile/${loggedin}`}>Profile</Link>
            <Link to={"/explore"}>Explore</Link>
            <button onClick={logOut}>Logout</button>
          </div>
        ) : <></>}
        </div>
      </div>
    </>
  );
};

export default NavBar;

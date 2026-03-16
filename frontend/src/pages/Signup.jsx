import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [sigining , setSigning] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSigning(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
        username: username,
        email: email,
        password: password,
      }, { withCredentials: true });
      console.log(res.data)
      setErrors({});
      setEmail("");
      setUsername("");
      setPassword("");
      localStorage.setItem("email" ,email)
      navigate("/verification");
    } catch (err) {
      setSigning(false)
      const tempErrors = {};
      const errorArray = err.response.data.errors;
      errorArray.forEach((e) => {
        tempErrors[e.path] = e.msg;
      });
      setErrors(tempErrors);
      console.log(tempErrors);
      console.log(err.response.data.errors);
      console.log(err.response.data.errors[0].msg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-white flex flex-col overflow-hidden ">

      {/* ── NAV ── */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight text-white">
          Vortex
        </span>
        <Link
          to="/login"
          className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 border border-zinc-700 hover:border-zinc-400 px-4 py-1.5 rounded-full"
        >
          Log in
        </Link>
      </nav>

      {/* ── BODY ── */}
      <div className="flex flex-1 flex-col lg:flex-row">

        {/* ── LEFT: Landing copy ── */}
        <div className="flex-col justify-center px-8 md:px-16 lg:px-20 pt-14 pb-10 lg:py-20 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-white/10 hidden sm:flex">

          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-6">
            Your new conversation space
          </p>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight text-white mb-6">
            Where real<br />
            <span className="text-zinc-500 font-normal italic">conversations (Baatcheet)</span><br />
            happen.
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed max-w-sm mb-10">
            Join thousands of people already talking, sharing, and connecting — no noise, no algorithm, just honest dialogue.
          </p>

          {/* Stats */}

          
        </div>

        {/* ── RIGHT: Signup Form ── */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-14 lg:py-20 lg:w-1/2">

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">
            Create your account
          </h2>
          <p className="text-zinc-500 text-sm mb-8">
            Free forever. No credit card needed.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. bhavya_minocha"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-900 text-white text-sm placeholder:text-zinc-600 outline-none border transition-colors duration-150
                  ${errors.username ? "border-red-500" : "border-zinc-800 focus:border-zinc-500"}`}
              />
              {errors.username && <p className="text-red-400 text-xs pl-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Email
              </label>
              <input
                type="text"
                placeholder="e.g. bhavya@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-900 text-white text-sm placeholder:text-zinc-600 outline-none border transition-colors duration-150
                  ${errors.email ? "border-red-500" : "border-zinc-800 focus:border-zinc-500"}`}
              />
              {errors.email && <p className="text-red-400 text-xs pl-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-900 text-white text-sm placeholder:text-zinc-600 outline-none border transition-colors duration-150
                  ${errors.password ? "border-red-500" : "border-zinc-800 focus:border-zinc-500"}`}
              />
              {errors.password && <p className="text-red-400 text-xs pl-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            {sigining ? (<div className="w-full bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-semibold text-sm cursor-progress py-3.5 rounded-xl  mt-1 tracking-wide text-center">Creating</div>) : (<button
              type="submit"
              className="w-full bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-semibold text-sm cursor-pointer py-3.5 rounded-xl  mt-1 tracking-wide hover:scale-95 transition-all duration-500"
            >
              Create Account →
            </button>)}
          </form>

          {/* Login link */}
          <div className="mt-10 pt-8 border-t border-white/10 w-full max-w-md">
            <p className="text-zinc-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-white font-semibold hover:underline underline-offset-2">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
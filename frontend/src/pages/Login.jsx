import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isUser, setisUser] = useState(true);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/users/login", {
        email: email,
        password: password,
      }, { withCredentials: true });
      setisUser(true);
      setErrors({});
      console.log(res.data);
      navigate(`/users/profile/${res.data.user._id}`);
    } catch (err) {
      const errorArray = await err.response.data.errors;
      console.log(errorArray);
      if (errorArray) {
        setErrors({});
        const tempError = {};
        errorArray.forEach((e) => tempError[e.path] = e.msg);
        setErrors(tempError);
      } else {
        setisUser(false);
        setErrors({});
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-white flex flex-col">

      {/* ── NAV ── */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10">
        <span className="text-xl sm:text-3xl font-bold tracking-tight text-[#21ad21]">
          Vortex
        </span>
        <Link
          to="/"
          className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 border border-zinc-700 hover:border-zinc-400 px-4 py-1.5 rounded-full"
        >
          Sign up
        </Link>
      </nav>

      {/* ── BODY ── */}
      <div className="flex flex-1 flex-col lg:flex-row">

        {/* ── LEFT: Branding copy ── */}
        <div className="hidden flex-col justify-center px-8 md:px-16 lg:px-20 pt-14 pb-10 lg:py-20 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-white/10 sm:flex">

          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-6">
            Welcome back
          </p>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight text-white mb-6">
            Good to see<br />
            <span className="text-zinc-500 font-normal italic">you again.</span>
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed max-w-sm mb-10">
            Pick up right where you left off. Your conversations, your people — all waiting for you.
          </p>


        </div>

        {/* ── RIGHT: Login Form ── */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-14 lg:py-20 lg:w-1/2">

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">
            Log in to your account
          </h2>
          <p className="text-zinc-500 text-sm mb-8">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleClick} className="flex flex-col gap-5 w-full max-w-md">

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-900 text-white text-sm placeholder:text-zinc-600 outline-none border transition-colors duration-150
                  ${errors.password ? "border-red-500" : "border-zinc-800 focus:border-zinc-500"}`}
              />
              {errors.password && <p className="text-red-400 text-xs pl-1">{errors.password}</p>}
            </div>

            {/* Invalid credentials error */}
            {!isUser && (
              <p className="text-red-400 text-xs pl-1">Invalid email or password. Please try again.</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-semibold text-sm py-3.5 rounded-xl transition-colors duration-150 mt-1 tracking-wide"
            >
              Log in →
            </button>

          </form>

          {/* Signup link */}
          <div className="mt-10 pt-8 border-t border-white/10 w-full max-w-md">
            <p className="text-zinc-500 text-sm">
              Don't have an account?{" "}
              <Link to="/" className="text-white font-semibold hover:underline underline-offset-2">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;
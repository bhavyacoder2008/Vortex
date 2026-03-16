import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProfilePic = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!profilePic) {
      navigate("/addbio");
      return;
    }
    const formdata = new FormData();
    formdata.append("profile", profilePic);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/addProfilePic`,
        formdata,
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/addbio");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChange = (e) => {
    setProfilePic(e.target.files[0]);
    setPreviewImg(URL.createObjectURL(e.target.files[0]));
  };

  const skipForNow = () => {
    navigate("/addbio");
  };

  return (
    <div className="min-h-screen w-screen bg-[#05060f] flex items-center justify-center px-4 py-6 relative overflow-hidden">

      <div className="absolute top-[-160px] left-[-140px] w-[500px] h-[500px] rounded-full bg-indigo-500 opacity-15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] rounded-full bg-indigo-400 opacity-10 blur-[100px] pointer-events-none" />


      <div className="relative z-10 w-full max-w-[440px] bg-[#0d1117] border border-indigo-500/20 rounded-3xl px-9 pt-10 pb-9 shadow-2xl">


        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent rounded-full" />

        <div className="flex items-center gap-3 mb-8">
          <span className="font-extrabold text-xl text-white tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Vortex
          </span>
        </div>

        <h1 className="font-extrabold text-[26px] text-slate-100 tracking-tight leading-tight mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>
          Add a profile photo
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-7">
          Put a face to your name. You can always change this later.
        </p>

        {previewImg ? (
          <>
          <div><img
            src={previewImg}
            alt="Preview"
            onClick={() => { setPreviewImg(null); setProfilePic(null); }}
            className="w-full h-48 object-cover rounded-2xl border border-indigo-500/20 mb-4 cursor-pointer"
          />
          </div>
          <div className="text-white text-center text-sm text-nowrap sm:text-lg">Click on the image to remove</div>
          </>
        ) : 

        (<><input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-slate-500 mb-1
            file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
            file:bg-indigo-500/15 file:text-indigo-400 file:font-semibold file:text-xs
            file:cursor-pointer hover:file:bg-indigo-500/25 file:transition-colors"
        />
        <p className="text-slate-700 text-xs mb-7 pl-0.5">JPG, PNG or GIF · Max 5MB</p></>)}

        <button
          type="button"
          onClick={handleClick}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:opacity-90 hover:-translate-y-px active:translate-y-0 transition-all duration-150 mb-2.5"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Upload Photo →
        </button>
        <button
          type="button"
          onClick={skipForNow}
          className="w-full py-3.5 rounded-2xl border border-indigo-500/15 bg-transparent text-slate-500 font-semibold text-sm hover:border-indigo-500/30 hover:text-slate-400 hover:bg-indigo-500/5 transition-all duration-150"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Skip for now
        </button>

        {/* step dots */}
        <div className="flex items-center justify-center gap-2 mt-7">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <span className="w-5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default AddProfilePic;
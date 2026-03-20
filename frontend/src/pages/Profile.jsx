import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dp, setdp] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [postimg, setPostimg] = useState(null);
  const [imgError, setImgError] = useState("");
  const [caption, setCaption] = useState("");
  const [displayCaption, setDisplayCaption] = useState("");
  const [fetchUser, setFetchUser] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [isSameuser, setIsSameUser] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [singleImage, setSingleImage] = useState("");
  const [followers, setFollowers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [displayImageId, setDisplayImageId] = useState("");
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [isThisPostLikedByLoggedInUser, setIsThisPostLikedByLoggedInUser] = useState(false);
  const [comment, setComment] = useState("");
  const [displayComments, setDisplayComments] = useState([]);
  const [loggedInuserdetails, setLoggedInUserDetails] = useState({});
  const [posting , setPosting] = useState(false)
  const [isGuest,setIsguest] = useState(false)
  const [loading , setLoading] = useState(true)

  function formatInstaTime(val) {
    const past = new Date(val);
    const now = new Date();
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  }

  const handleChanging = (e) => {
    const file = e.target.files[0];
    setPostimg(file); //the one that will be gone on the imageKit
    setPreviewImg(URL.createObjectURL(file)); ///the one that will be shown as a preview
  };

  const handleClick = async () => {
    const formdata = new FormData();
    formdata.append("image", postimg);
    formdata.append("caption", caption);
    if (!postimg) {
      setImgError("Image is required...");
      return;
    }
    try {
      setPosting(true)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/createPost`,
        formdata,
        { withCredentials: true },
      );

      console.log(res);
      (setPreviewImg(null), setShowPostModal(null), setCaption(""));
      setFetchUser(!fetchUser);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${id}`, {
        withCredentials: true,
      });
      setIsFollowing(res.data.user.followers.includes(res.data.loggedIn));
      setUsername(res.data.user.username);
      setBio(res.data.user.bio);
      setdp(res.data.user.profilePic);
      setIsSameUser(res.data.user._id === res.data.loggedIn);
      setFollowers(res.data.user.followers.length);
      setFollowing(res.data.user.following.length);
      setTotalPosts(res.data.user.posts.length);
      setLoggedInUserId(res.data.loggedIn);
      setIsguest(res.data.isGuest)
      setLoading(false)
    };

    const getPosts = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/userPosts/${id}`,
        {
          withCredentials: true,
        },
      );
      console.log(res.data);
      setUserPosts(res.data);
    };

    const getLoggedInuserDetails = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/loggedInuserDetails`, { withCredentials: true });
      setLoggedInUserDetails(res.data)
    }

    getUser();
    getPosts();
    getLoggedInuserDetails();
  }, [fetchUser, id]); //jab ham follower list ya following list se dusre ki id par jayengein tab ye getUser wapas call hona chahaiye taaki

  const openFollowersModal = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/getFollowers/${id}`,
        { withCredentials: true },
      );
      console.log(res.data);
      setFollowersList(res.data);
    } catch (err) {
      console.log(err);
    }
    setShowFollowersModal(true);
  };

  const openFollowingModal = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/getFollowing/${id}`,
        { withCredentials: true },
      );
      setFollowingList(res.data);
    } catch (err) {
      console.log(err);
    }
    setShowFollowingModal(true);
  };

  const handleLike = async () => {
    try {
      if (!isThisPostLikedByLoggedInUser) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/post/like/${displayImageId}`,
          {},
          { withCredentials: true },
        );
        setNumOfLikes(numOfLikes + 1);
        console.log(res)
      }
      else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/post/unlike/${displayImageId}`, {}, { withCredentials: true });
        setNumOfLikes(numOfLikes - 1);

      }
    } catch (err) {
      console.log(err);
    }
    setIsThisPostLikedByLoggedInUser(!isThisPostLikedByLoggedInUser)
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      return;
    }
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/post/comment/${displayImageId}`, {
      text: comment
    },
      {
        withCredentials: true
      })
    console.log(res.data)
    setDisplayComments([...displayComments, { owner: loggedInuserdetails, text: comment, timestamps: Date.now() }])
    setComment("")
  }

  return (
    <>
    
      <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
        {/* ── Navbar ── */}

        {/* <NavBar /> */}


      <NavBar />

        {/* ── Main content ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">

          {/* ── Profile top section ── */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12 mb-16 bg-slate-900/40 p-8 rounded-3xl border border-white/5 shadow-2xl shadow-indigo-900/10 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

            {/* Avatar */}
            <div className="shrink-0 relative">
              <div className="p-1 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-slate-950 bg-slate-800 relative z-10">
                  <img
                    src={dp}
                    alt="profile"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
            {/* Info */}
            <div className="flex flex-col items-center sm:items-start gap-6 flex-1 w-full z-10">
              {/* Username + Edit + Create Post / Follow */}
              {!isSameuser ? (
                <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                    {username}
                  </h2>
                  {isGuest ? (<div></div>) : 
                    (isFollowing ? (
                      <button
                        className="px-5 py-2 bg-linear-to-r from-white to-blue-300 hover:from-indigo-400 hover:cursor-pointer hover:to-purple-500 text-[#111] rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-lg shadow-indigo-500/30 active:scale-95"
                        onClick={async () => {
                          const res = await axios.post(
                            `${import.meta.env.VITE_API_URL}/users/unfollow/${id}`,
                            {},
                            { withCredentials: true },
                          );
                          setFollowers(res.data.updatedFollowers);
                          setIsFollowing(false);
                        }}
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="px-5 py-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:cursor-pointer hover:to-purple-500 text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-lg shadow-indigo-500/30 active:scale-95"
                        onClick={async () => {
                          const res = await axios.post(
                            `${import.meta.env.VITE_API_URL}/users/follow/${id}`,
                            {},
                            { withCredentials: true },
                          );
                          setFollowers(res.data.updatedFollowers);
                          setIsFollowing(true);
                        }}
                      >
                        Follow
                      </button>
                    ))
                  }

                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                    {username || "username"}
                  </h2>
                  <button
                    onClick={() => setShowPostModal(true)}
                    className="px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/30 active:scale-95 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Post
                  </button>
                </div>
              )}
              {/* Stats */}
              <div className="flex divide-x divide-white/10 bg-slate-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-1 shadow-inner">
                <div className="flex flex-col items-center px-6 py-3 hover:bg-white/5 rounded-l-xl transition-colors cursor-default">
                  <span className="font-black text-white text-xl leading-tight">
                    {totalPosts}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase mt-1">
                    Posts
                  </span>
                </div>
                {/* ── CHANGED: Followers now clickable ── */}
                <div
                  className="flex flex-col items-center px-6 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={openFollowersModal}
                >
                  <span className="font-black text-white text-xl leading-tight">
                    {followers}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase mt-1">
                    Followers
                  </span>
                </div>
                {/* ── CHANGED: Following now clickable ── */}
                <div
                  className="flex flex-col items-center px-6 py-3 hover:bg-white/5 rounded-r-xl transition-colors cursor-pointer"
                  onClick={openFollowingModal}
                >
                  <span className="font-black text-white text-xl leading-tight">
                    {following}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase mt-1">
                    Following
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="text-base text-center sm:text-left max-w-lg mt-2">
                <p className="text-slate-300 leading-relaxed font-medium">
                  {bio}
                </p>
              </div>
            </div>
          </div>

          {/* ── Divider with label ── */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="text-sm font-bold uppercase tracking-widest">
                Posts
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* ── Posts Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-x-0">
            {userPosts.map((item) => (
              <div
                key={item._id}
                className="group relative w-[80%] aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer"
                onClick={async () => {
                  const postDetails = await axios.get(
                    `${import.meta.env.VITE_API_URL}/post/singlePost/${item._id}`,
                    { withCredentials: true },
                  );
                  setSingleImage(postDetails.data.image);
                  setDisplayCaption(postDetails.data.caption);
                  setDisplayImageId(postDetails.data._id);
                  setNumOfLikes(postDetails.data.likes.length);
                  setIsThisPostLikedByLoggedInUser(
                    postDetails.data.likes.includes(loggedInUserId),
                  );
                  setDisplayComments(postDetails.data.comments)
                  console.log(postDetails.data.comments)
                  setPostModal(true);
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-700/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-[#f2ff2f] font-medium drop-shadow-md flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 0 015.656 0L10 6.343l1.172-1.171a4 0 115.656 5.656L10 17.657l-6.828-6.829a4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Post View Modal ── */}
          {postModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md sm:p-4"
              onClick={() => setPostModal(false)}
            >
              <div
                className="w-full sm:max-w-4xl sm:max-h-[88vh] h-full sm:h-auto bg-slate-900 sm:border border-white/10 sm:rounded-2xl overflow-hidden flex flex-col sm:flex-row sm:mt-4 relative animate-popup"
                onClick={(e) => e.stopPropagation()}
              >

                {/* ── MOBILE: Floating header over image ── */}
                <div className="sm:hidden absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 p-0.5 shrink-0">
                    <img src={dp} alt="User" className="w-full h-full rounded-full object-cover ring-2 ring-slate-900" />
                  </div>
                  <span className="text-sm font-semibold text-white flex-1">{username}</span>
                  <button
                    onClick={() => setPostModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[13px] w-[13px]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* ── Left: Image ── */}
                <div className="w-full sm:w-[55%] flex-shrink-0 bg-slate-950 sm:border-b-0 sm:border-r border-white/[0.08]">
                  <div className="w-full aspect-square">
                    <img src={singleImage} className="w-full h-full object-cover" alt="Post" />
                  </div>
                </div>

                {/* ── Right: Info + Interactions ── */}
                <div className="flex-1 flex flex-col min-h-0 bg-slate-900 overflow-hidden">

                  {/* Header — desktop only */}
                  <div className="hidden sm:flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 p-0.5 shrink-0">
                      <img src={dp} alt="User" className="w-full h-full rounded-full object-cover ring-2 ring-slate-900" />
                    </div>
                    <span className="text-sm font-semibold text-white flex-1 tracking-tight">{username}</span>
                    <button
                      onClick={() => setPostModal(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[13px] w-[13px]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Comments scroll */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {displayCaption && (
                      <div className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 p-0.5 shrink-0">
                          <img src={dp} alt="User" className="w-full h-full rounded-full object-cover ring-1 ring-slate-900" />
                        </div>
                        <div className="pt-0.5">
                          <span className="text-[13px] font-semibold text-white/85 mr-2">{username}</span>
                          <span className="text-[13px] text-slate-400">{displayCaption}</span>
                        </div>
                      </div>
                    )}

                    {displayComments.map((eachComment) => (
                      <div key={eachComment.timestamps} className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 shrink-0 overflow-hidden">
                          <img src={eachComment.owner.profilePic} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2 flex-1 min-w-0">
                          <span className="text-[13px] font-semibold text-white/80 mr-2">
                            {eachComment.owner.username.toUpperCase()}
                          </span>
                          <span className="text-[13px] text-slate-400 break-words">{eachComment.text}</span>
                          <p className="text-[11px] text-slate-600 mt-1 tracking-wide">
                            {formatInstaTime(eachComment.timestamps)} ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  {isGuest ? <div></div>: <div className="border-t border-white/[0.08] px-4 py-3 shrink-0 bg-slate-900">
                    <div className="flex items-center gap-4 mb-2">
                      {isThisPostLikedByLoggedInUser ? (
                        <button className="group cursor-pointer" onClick={handleLike}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-700 fill-red-600 group-hover:scale-110 transition-transform duration-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </button>
                      ) : (
                        <button className="group cursor-pointer text-slate-400 hover:text-pink-500" onClick={handleLike}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 group-hover:fill-pink-500/20 transition-all duration-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </button>
                      )}
                      <button className="text-slate-400 hover:text-indigo-400 transition-all duration-200 group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 group-hover:fill-indigo-500/20 transition-all duration-200">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[13px] font-semibold text-white/75 mb-2">{numOfLikes} likes</p>

                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-800 shrink-0 overflow-hidden ring-1 ring-white/10">
                        <img src={loggedInuserdetails.profilePic} alt="User" className="w-full h-full object-cover" />
                      </div>
                      <input
                        type="text"
                        placeholder="Add a comment…"
                        className="flex-1 bg-transparent text-[13px] text-white/75 placeholder:text-slate-600 outline-none border-b border-white/[0.12] focus:border-indigo-500 transition-colors py-1"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        className="text-indigo-400 text-[13px] font-semibold hover:text-indigo-300 transition-colors"
                        onClick={handleComment}
                      >
                        Post
                      </button>
                    </div>
                  </div>}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create Post Modal ── */}
      {showPostModal && (
        <div
          className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          onClick={() => setShowPostModal(false)}
        >
          <div
            className="w-full sm:max-w-xl bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-indigo-500/10 p-6 sm:p-8 relative overflow-hidden animate-popup"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

            {/* Drag pill — mobile only */}
            <div className="flex justify-center mb-6 sm:hidden">
              <div className="w-12 h-1.5 rounded-full bg-slate-700"></div>
            </div>

            {/* Modal header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                  Create a Post
                </h3>
                <p className="text-slate-400 text-sm mt-1 font-medium">
                  Share your moments with the world
                </p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 transition-all duration-200 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Inputs Container - Allows scrolling if content is too tall */}
            <div className="flex flex-col gap-6 w-full max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-2">
              {/* Image Upload */}
              {previewImg ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden group/preview border border-white/10 bg-slate-950 shrink-0 shadow-inner">
                  <img
                    src={previewImg}
                    alt="preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover/preview:bg-slate-950/60 transition-all duration-300 backdrop-blur-[2px] opacity-0 group-hover/preview:opacity-100 flex items-center justify-center">
                    <button
                      onClick={() => setPreviewImg(null)}
                      className="px-6 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white border border-rose-500/50 text-sm font-bold backdrop-blur-md transition-all duration-300 shadow-xl shadow-rose-500/20 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 shrink-0">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Photo
                  </label>
                  <label className="group relative flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-slate-700/70 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex flex-col items-center gap-4 pointer-events-none relative z-10">
                      <div className="w-16 h-16 rounded-full bg-slate-700/50 group-hover:bg-indigo-500/20 group-hover:scale-110 flex items-center justify-center transition-all duration-500 shadow-inner">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 13.5V5.625c0-1.036.835-1.875 1.875-1.875h10.125A1.875 1.875 0 0119.875 5.625V13.5m-10.5 0h10.5m-10.5 0L3 16.5m3-3l3 3m6 0l3-3m-3 3v2.25A2.25 2.25 0 0116.5 21h-9A2.25 2.25 0 015.25 19.5V17.25"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold text-slate-300 group-hover:text-white transition-colors duration-300">
                          Upload a photo
                        </p>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                          Drag and drop or click to browse
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleChanging(e)}
                    />
                  </label>
                </div>
              )}

              {/* Caption */}
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Caption
                  </label>
                  <span className="text-xs text-slate-500 font-medium">
                    Optional
                  </span>
                </div>
                <div className="relative group">
                  <textarea
                    placeholder="Write a caption for your post…"
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-slate-800/60 text-white text-base font-medium placeholder:text-slate-500 outline-none focus:border-indigo-500/50 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all duration-300 shadow-inner"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 bg-slate-700/50 backdrop-blur-md px-2 py-1 rounded-md shadow-sm">
                    <span className="text-xs font-bold text-slate-400">
                      {caption.length}/100
                    </span>
                  </div>
                </div>
              </div>

              {imgError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-start gap-3 animate-pulse shrink-0">
                  <span className="text-rose-500 mt-0.5 animate-bounce">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <p className="text-sm text-rose-200 font-bold">{imgError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-bold transition-all duration-300 active:scale-95 shadow-sm"
                >
                  Cancel
                </button>
                {posting ? <div className = "flex-1 py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-bold transition-all duration-300 shadow-xl shadow-indigo-500/20 active:scale-95 flex justify-center items-center gap-2 cursor-progress">Posting</div> : (<button
                  type="button"
                  className="flex-1 py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-bold transition-all duration-300 shadow-xl shadow-indigo-500/20 active:scale-95 flex justify-center items-center gap-2"
                  onClick={handleClick}
                >
                  Post Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>)}
              </div>
            </div>
          </div>
        </div>
      )}
      {showFollowersModal && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-popup"
          onClick={() => setShowFollowersModal(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Followers
              </h3>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {/* List */}
            <div className="overflow-y-auto max-h-96 divide-y divide-white/5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {followersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mb-3 opacity-40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm font-semibold">No followers yet</p>
                </div>
              ) : (
                followersList.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => {
                      navigate(`/users/profile/${user._id}`);
                      setShowFollowersModal(false);
                    }}
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 ring-2 ring-white/10 shrink-0">
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {user.username}
                      </p>
                      {/* {user.bio && <p className="text-xs text-slate-400 truncate font-medium mt-0.5">{user.bio}</p>} */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── NEW: Following Modal ── */}
      {showFollowingModal && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-popup"
          onClick={() => setShowFollowingModal(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Following
              </h3>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {/* List */}
            <div className="overflow-y-auto max-h-96 divide-y divide-white/5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {followingList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mb-3 opacity-40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm font-semibold">
                    Not following anyone yet
                  </p>
                </div>
              ) : (
                followingList.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => {
                      navigate(`/users/profile/${user._id}`);
                      setShowFollowingModal(false);
                    }}
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 ring-2 ring-white/10 shrink-0">
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {user.username}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

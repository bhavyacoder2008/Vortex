import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FeedPosts = ({ feedPosts }) => {
  //here we need loggedIn user details and owner of the post details
  // first we'll fetch loggedIn user details

  const navigate = useNavigate();

  const [logInUserDetails, setLogInUserDetails] = useState({});

  useEffect(() => {
    const details = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/loggedInuserDetails`,
          { withCredentials: true },
        );
        console.log(res.data);
        setLogInUserDetails(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    details();
  }, []);

  //we also have to fetch posts which we have done in Feed.jsx and got it as a prop named feedPosts
  //now each feedPost will have all details related to the post i.e.. who is the owner the comments etc etc ....
  //in line 40-49 there are several state setters which will set the details once any post is clicked

  //initializing all the states from line 40-49

  const [singleImage, setSingleImage] = useState("");
  const [displayCaption, setDisplayCaption] = useState("");
  const [displayImageId, setDisplayImageId] = useState("");
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [isThisPostLikedByLoggedInUser, setIsThisPostLikedByLoggedInUser] =
    useState(false);
  const [displayComments, setDisplayComments] = useState([]);
  const [postModal, setPostModal] = useState(false);
  const [postOwner, setpostOwner] = useState({});

  const handleComment = async () => {
    if (!comment.trim()) {
      return;
    }
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/post/comment/${displayImageId}`,
      {
        text: comment,
      },
      {
        withCredentials: true,
      },
    );
    console.log(res.data);
    setDisplayComments([
      ...displayComments,
      { owner: logInUserDetails, text: comment, timestamps: Date.now() },
    ]);
    setComment("");
  };

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

  const handleLike = async () => {
    try {
      if (!isThisPostLikedByLoggedInUser) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/post/like/${displayImageId}`,
          {},
          { withCredentials: true },
        );
        setNumOfLikes(numOfLikes + 1);
        console.log(res);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/post/unlike/${displayImageId}`,
          {},
          { withCredentials: true },
        );
        setNumOfLikes(numOfLikes - 1);
      }
    } catch (err) {
      console.log(err);
    }
    setIsThisPostLikedByLoggedInUser(!isThisPostLikedByLoggedInUser);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-x-4 pl-12 bg-[#020618]">
        {feedPosts.map((item) => (
          <>
          <div
            key={item._id}
            className="group relative w-[80%] sm:w-[70%] aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/20 transition-all cursor-pointer"
            onClick={async () => {
              const postDetails = await axios.get(
                `${import.meta.env.VITE_API_URL}/post/singlePost/${item._id}`,
                { withCredentials: true }
              );
              const postOwnerDetails = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/profile/${postDetails.data.owner}`,
                { withCredentials: true }
              );
              setpostOwner(postOwnerDetails.data.user);
              setSingleImage(postDetails.data.image);
              setDisplayCaption(postDetails.data.caption);
              setDisplayImageId(postDetails.data._id);
              setNumOfLikes(postDetails.data.likes.length);
              setIsThisPostLikedByLoggedInUser(
                postDetails.data.likes.includes(logInUserDetails._id)
              );
              setDisplayComments(postDetails.data.comments);
              console.log(postDetails.data.comments);
              setPostModal(true);
            } }
          >
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 animate-popup" />
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
                    clipRule="evenodd" />
                </svg>
                View
              </span>
            </div>
          </div></>
        ))}

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
                  <img
                    src={postOwner.profilePic}
                    alt="User"
                    className="w-full h-full rounded-full object-cover ring-2 ring-slate-900"
                  />
                </div>
                <span className="text-sm font-semibold text-white flex-1"
                  onClick = {() => navigate(`/users/profile/${postOwner._id}`)}
                
                >

                  {postOwner.username}
                </span>
                <button
                  onClick={() => setPostModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[13px] w-[13px]"
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

              {/* ── Left: Image ── */}
              <div className="w-full sm:w-[55%] flex-shrink-0 bg-slate-950 sm:border-b-0 sm:border-r border-white/[0.08]">
                <div className="w-full aspect-square">
                  <img
                    src={singleImage}
                    className="w-full h-full object-cover"
                    alt="Post"
                  />
                </div>
              </div>

              {/* ── Right: Info + Interactions ── */}
              <div className="flex-1 flex flex-col min-h-0 bg-slate-900 overflow-hidden">
                {/* Header — desktop only */}
                <div className="hidden sm:flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 p-0.5 shrink-0">
                    <img
                      src={postOwner.profilePic}
                      alt="User"
                      className="w-full h-full rounded-full object-cover ring-2 ring-slate-900"
                    />
                  </div>
                  <span className="text-sm font-semibold text-white flex-1 tracking-tight cursor-pointer"
                  onClick = {() => navigate(`/users/profile/${postOwner._id}`)}

                  
                  >
                    {postOwner.username}
                  </span>
                  <button
                    onClick={() => setPostModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[13px] w-[13px]"
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

                {/* Comments scroll */}
                <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {displayCaption && (
                    <div className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 p-0.5 shrink-0">
                        <img
                          src={postOwner.profilePic}
                          alt="User"
                          className="w-full h-full rounded-full object-cover ring-1 ring-slate-900"
                        />
                      </div>
                      <div className="pt-0.5">
                        <span className="text-[13px] font-semibold text-white/85 mr-2 cursor-pointer"
                          onClick = {() => navigate(`/users/profile/${postOwner._id}`)}
                         
                        >
                          {postOwner.username}
                        </span>
                        <span className="text-[13px] text-slate-400">
                          {displayCaption}
                        </span>
                      </div>
                    </div>
                  )}

                  {displayComments.map((eachComment) => {
                    console.log(eachComment)
                    return(
                    <div
                      key={eachComment.timestamps}
                      className="flex items-start gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 shrink-0 overflow-hidden">
                        <img
                          src={eachComment.owner.profilePic}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2 flex-1 min-w-0">
                        <span className="text-[13px] font-semibold text-white/80 mr-2">
                          {eachComment.owner.username.toUpperCase()}
                        </span>
                        <span className="text-[13px] text-slate-400 break-words">
                          {eachComment.text}
                        </span>
                        <p className="text-[11px] text-slate-600 mt-1 tracking-wide">
                          {formatInstaTime(eachComment.timestamps)} ago
                        </p>
                      </div>
                    </div>
                  )})}
                </div>

                {/* Actions */}
                <div className="border-t border-white/[0.08] px-4 py-3 shrink-0 bg-slate-900">
                  <div className="flex items-center gap-4 mb-2">
                    {isThisPostLikedByLoggedInUser ? (
                      <button
                        className="group cursor-pointer"
                        onClick={handleLike}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-red-700 fill-red-600 group-hover:scale-110 transition-transform duration-200"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="group cursor-pointer text-slate-400 hover:text-pink-500"
                        onClick={handleLike}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 group-hover:scale-110 group-hover:fill-pink-500/20 transition-all duration-200"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                    )}
                    <button className="text-slate-400 hover:text-indigo-400 transition-all duration-200 group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 group-hover:scale-110 group-hover:fill-indigo-500/20 transition-all duration-200"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-[13px] font-semibold text-white/75 mb-2">
                    {numOfLikes} likes
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-800 shrink-0 overflow-hidden ring-1 ring-white/10">
                      <img
                        src={logInUserDetails.profilePic}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FeedPosts;

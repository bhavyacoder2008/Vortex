import React, { useState } from 'react'
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';


// react flow -->
/*

1. when we press something on the input fiels onchange gets fired,
2. query gets setted but only after onchange gets over
3. result gets set to empty array but onyly afetr onChange overs
4. handlechange gets called with the value whihc we have typed in that
4a. if its empty it returns , setresult of handlechange gets called and it sets it to the rsult we get
4b but this also changes after after onchange gets over which will be over once handlechange gets ovr

5. now handlechange is finished the ui gets reconstructed with


1 => query changed to what we have typed
2 => result becomes empty array
3 => result gets filled with new things 

4=> the process of emptying is necessaary ig coz jab ham backspace daba daba ke khali karte hain tab handlechange mein return ho jaata hai 
but result ko empty to hona chahiye na ye help karta hai ek extra request se bachane ke liye coz agar return statemnt nahi hogi to 
value = "" ke liye bhi post request jayegi jo ki bekaar hi hai na lol

*/

const Explore = () => {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);

    const navigate = useNavigate()

    const handleChange = async (value) => {
        if (value === "") {
            return;
        }
        const res = await axios.post(`http://localhost:3000/users/searchUsers/?q=${value}`, {}, { withCredentials: true });
        setResult(res.data)
        console.log(res.data)
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-[#0a0a0f] text-white">
                <div className="max-w-2xl mx-auto px-6 py-14">

                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6c6c8a] mb-2">
                        Discover
                    </p>
                    <h1 className="text-4xl font-extrabold text-[#f0f0ff] mb-10 tracking-tight">
                        Find{' '}
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                            People
                        </span>
                    </h1>

                    {/* Search Input */}
                    <div className="relative mb-8">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c6c8a] text-lg pointer-events-none select-none">
                            ⌕
                        </span>
                        <input
                            className="w-full bg-[#13131f] border border-[#1e1e2e] rounded-2xl py-4 pl-12 pr-5 text-[#e8e8f0] placeholder-[#3a3a55] text-sm outline-none transition-all duration-200 focus:border-violet-700 focus:bg-[#16162a] focus:ring-4 focus:ring-violet-500/10 caret-violet-400"
                            type="text"
                            name="bhavya"
                            value={query}
                            placeholder="Search by username..."
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setResult([]) //har ek onchange ke baad result ko wapas empty kar do taaki new wala freshly aa sakte
                                handleChange(e.target.value)
                            }}
                        />
                    </div>

                    {/* Results List */}
                    <div className="flex flex-col gap-2">
                        {result.length > 0 ? (
                            result.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 px-5 py-4 bg-[#13131f] border border-[#1a1a2a] rounded-xl cursor-pointer transition-all duration-150 hover:bg-[#1a1a2e] hover:border-[#2e2e4a] hover:translate-x-1 group"
                                    onClick={() => navigate(`/users/profile/${val._id}`)}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-[#2a2a40] flex items-center justify-center text-violet-400 font-bold text-sm uppercase flex-shrink-0">
                                        <img src={val.profilePic} className='w-full h-full overflow-hidden rounded-4xl' alt="" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <p className="text-[#d8d8f0] text-sm font-medium">{val.username}</p>
                                    </div>
                                </div>
                            ))) : (
                            <div className="text-center py-14">
                                <p className="text-[#1414ff] text-sm sm:text-xl">Start typing to search users...</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Explore
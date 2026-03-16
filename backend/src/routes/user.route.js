import express from "express";
import { loginValidation, signupValidation } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import jwt from "jsonwebtoken";
import authmiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";
import imagekit from "../config/imagekit.js";
import sendOtp from "../utils/sendOtp.js";

const router = express.Router();

router.post("/signup" , signupValidation , validate, async (req, res) => {
    const {username , email , password } = req.body;

    const otp = Math.floor(1000 + Math.random()*9000).toString();

    const hashedPass = await bcrypt.hash(password,8);
    const newUser = await User.create({
        username : username,
        email : email ,
        password : hashedPass,
        otp : otp,
        otpExpiry : Date.now() + 5*30*1000
    });

    await sendOtp(email,otp);

    res.json({
        message : "OTP sent successfully"
    })
    

    // res.json({message : "User created successfully", newUser , loggedIn : req.user});
})

router.post("/otpVerification" , async (req,res) => {
    const {email , otp} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.json({message : "User not found"})
    }
    const isVerified = String(otp) === String(user.otp);
    if(!isVerified){
        return res.status(404).json({message : "Invalid OTP"})
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    
    const token = jwt.sign({
        id : user._id
    },process.env.JWT_SECRET,{expiresIn : "1d"});

    res.cookie("token" , token , {
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 24*60*60*1000
    })
    
    
    res.json({message : "User verified ...."})
})

router.post("/login" , loginValidation , validate , async (req,res) => {
    const { email , password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            message : "Invalid Credentials..."
        })
    }

    if(!user.isVerified){
        return res.status(400).json({message : "jaa pahale verified hoke aa"})
    }

    const isTellingTruth = await bcrypt.compare(password,user.password);
    if(!isTellingTruth){
        return res.status(400).json({
            message : "Invalid credentials..."
        })
    }

    const token = jwt.sign({
        id : user._id,
    },
    process.env.JWT_SECRET,
    {expiresIn : "1d"
    }) //ye token ke andar loggedIN user ki info rahegi taaki kisi or request par bhi user ka ata pata rahe

    res.cookie("token" , token , {
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 24 * 60 * 60 * 1000
    })
    //this cookie will be stored in the browser and it will be sent to the server with every request so that we can verify the user is logged in or not
    //and we will verify the token in the protected routes to allow access to the logged in users only

    res.json({
        message : "Login successful",
        user,
        loggedIn : req.user
    })

    //here we will make a token after login which I ' ll learn shortly

})

router.get("/profile/:id" ,authmiddleware, async (req,res) => {

    const userByID = req.params.id;

    const user = await User.findById(userByID);

    res.json({
        user : user,
        loggedIn : req.user
    })
})
//no need of the below route now because we are sending the user id in the response of /profile route and we can use that id to fetch the user info in the frontend


// app.get("/fetchdata/:id" , async (req,res) => {
//     const id = req.params.id;
//     const user = await User.findOne({_id : id});
//     res.json({
//         username : user.username
//     })
// })

router.post("/addbio" , authmiddleware , async (req,res) => {
    const {bio} = req.body;
    // console.log(req.user)
    const user = await User.findById(req.user);
    user.bio = bio;
    await user.save();
    res.json({
        message : "Bio added successfully",
        user : user
    })
})

router.post("/addProfilePic" , authmiddleware , upload.single("profile") , async (req,res) => {
    try {
        const file = req.file;
        const id = req.user;
        
        if (!file) {
            return res.status(400).json({
                message: "Please upload a profile picture"
            });
        }

        const uploadedImg = await imagekit.files.upload({
            file : file.buffer.toString("base64"),
            fileName : file.originalname,
            folder : "test/profile_pics"
        }) 

        const updatedUser = await User.findByIdAndUpdate(id , {
            profilePic : uploadedImg.url
        },{new : true});

        res.status(200).json({
            message : "Profile pic added succesfully",
            updatedUser
        });
    } catch (error) {
        // console.log(error);
        res.status(400).json({
            message: error.message || "Failed to upload profile picture"
        });
    }
})


//in both follow case i will follow the approad ki ham jis user ko follow kiya hai uski id bhejein

router.post("/follow/:id" , authmiddleware , async (req,res) => {
    const userBeingFollowedId = req.params.id;
    //req.user ke andar uski id hogi jo login kar rakha hai yaani jis account se follow kiya hai
    const UserFollowingId = req.user;
    const userBeingFollowed = await User.findByIdAndUpdate(userBeingFollowedId , {
        $push : {followers : UserFollowingId}
    } , {new : true});
    const UserFollowing = await User.findByIdAndUpdate(UserFollowingId , {
        $push : {following : userBeingFollowedId}
    })

    res.json({
        updatedFollowers : userBeingFollowed.followers.length
    })

})


router.post("/unfollow/:id" , authmiddleware , async (req,res) => {
    const userBeingUnFollowedId = req.params.id; //ye hai jiski profile mein ham currently hain
    //req.user ke andar uski id hogi jo login kar rakha hai yaani jis account se follow kiya hai
    const UserUnFollowingId = req.user;
    const userBeingUnFollowed = await User.findByIdAndUpdate(userBeingUnFollowedId , {
        $pull : {followers : UserUnFollowingId}
    } , {new : true});
    await User.findByIdAndUpdate(UserUnFollowingId , {
        $pull : {following : userBeingUnFollowedId}
    })

    res.json({
        updatedFollowers : userBeingUnFollowed.followers.length
    })

})

//to get all the followers of a user
router.get("/getFollowers/:id" , authmiddleware , async (req,res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate("followers"); //it will replace the id in follower array with actual user info from users collection
    const followers = user.followers;
    res.status(200).json(followers);
})

router.get("/getFollowing/:id" , authmiddleware , async (req,res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate("following");
    const following = user.following;
    
    res.status(200).json(following);
    
})

router.get("/loggedInuserDetails" , authmiddleware , async(req,res) => {
    const id = req.user;
    const details = await User.findById(id);
    // console.log(details)
    res.json(details)
})

router.get("/feed" , authmiddleware , async (req,res) => {
    const id = req.user;
    // let posts = [];
    try{
        const followingObject = await User.findById(id).select("following"); //aalsi waY of doing .following lol
        // console.log(followingObject)
        if(!followingObject){
            // console.log("Following object not found")
        }

        const followingList = followingObject.following
        let posts = await Post.find({
            owner : {$in : followingList}
        }).populate("owner")
        .sort({createdAt : -1})
        .limit(20)
        // console.log(posts)
        res.json({posts , loggedInuser : req.user})

        }catch(err){
            // console.log(err)
     }


})

router.get("/getDetailswithPostID/:id" , authmiddleware , async (req,res) => {
    const post = await Post.findById(req.params.id).populate("owner");
    const owner = post.owner;
    // console.log(owner);
    res.json({owner , loggedInId : req.user})
});

router.post("/logout" , authmiddleware , (req,res) => {

    res.clearCookie("token",{
        httpOnly : true,
        secure : false,
        sameSite : "strict",
    })

    res.json({
        message : "User logged Out succesfully... "
    })
})

router.post("/searchUsers" , authmiddleware ,  async (req,res) => {
    const searchName = req.query.q;
    const users = await User.find({
        username : {$regex : searchName , $options : "i"}
    })
    res.json(users)
});

router.post("/feedUsers" , authmiddleware , async (req,res) => {
    try{
        const usersToshow = await User.find().sort({createdAt : -1}).limit(20);
        res.json(usersToshow);

    }catch(err){
        // console.log(err)
    }
    

})

export default router;
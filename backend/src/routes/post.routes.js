import express from "express"
import authmiddleware from "../middlewares/auth.middleware.js";
import Post from "../models/post.model.js";
import upload from "../middlewares/multer.js"
import imagekit from "../config/imagekit.js"
import User from "../models/user.model.js"

const router = express.Router();

router.post("/createPost" , authmiddleware ,upload.single("image"), async (req,res) => {

    const file = req.file;
    const {caption} = req.body;

    if(!file){
        return res.status(400).json({
            message : "Image is required"
        })
    }

    const id = req.user
    const uploadedImg = await imagekit.files.upload({
        file : file.buffer.toString("base64"),
        fileName : file.originalname,
        folder : "test"
    })

    const newPost = await Post.create({
        image : uploadedImg.url,
        caption : caption,
        owner : id
    })

    await User.findByIdAndUpdate(id , {
        $push : {posts : newPost._id}
    })


    res.status(200).json({
        message : "Post created successfully",
        newPost
    })
})

router.get("/userPosts/:id",authmiddleware , async (req,res) => {
    const id = req.params.id; //from URL parameter
    const posts = await Post.find({
        owner : id
    });
    res.status(200).json(posts)
})

router.get("/singlePost/:PostId" , authmiddleware , async (req,res) => {
    const postID = req.params.PostId
    const post = await Post.findById(postID).populate("comments.owner");
    console.log(post)
    res.json(post)
})

router.post("/like/:id" , authmiddleware , async (req,res) => {
    const postId = req.params.id;
    const likedUserId = req.user;

    const likedPost = await Post.findByIdAndUpdate(postId , {
        $addToSet : {likes : likedUserId}
    })

    res.status(200).json(likedPost)


})

router.post("/unlike/:id" , authmiddleware , async (req,res) => {
    const postId = req.params.id;
    const unLikingUserId = req.user;

    const unLikedPost = await Post.findByIdAndUpdate(postId , {
        $pull : {likes : unLikingUserId}
    })

    res.status(200).json(unLikedPost)
})

router.post("/comment/:id" , authmiddleware , async (req,res) => {
    const postId = req.params.id;
    const commentingUserId = req.user;
    const {text} = req.body;
    const commentedPost = await Post.findByIdAndUpdate(postId , {
        $push : {comments : {
            owner : commentingUserId,
            text : text
        }}
    },{new : true}).populate("comments.owner") //populate on the basis of owner field of comments owner mein abhi hamne userid rakhi hai agar populate kareingein to owner field mein owner ki details aa jayeingi from users collection
    res.json(commentedPost)
})

export default router;
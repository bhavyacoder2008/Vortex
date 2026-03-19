import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type : String, default : null},
    email : {type : String, default : null},
    password : {type : String, default : null},
    profilePic : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    bio : String,
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "post"
        }
    ],
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }
    ],
    following : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }
    ],
    isVerified : {
        type : Boolean,
        default : false
    },
    otp : {
        type : String,
        default : null
    },
    otpExpiry : {
        type : Date,
        default : null

    },

    isGuest : {
        type : Boolean,
        default : false
    }

    
    
});

const userModel = mongoose.model("users" , userSchema);

export default userModel;
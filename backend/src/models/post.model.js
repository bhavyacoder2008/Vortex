import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption : String,
    image : String,
    owner : {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId , ref : "users"
        }
    ],
    comments : [
        {
            owner : {
                type : mongoose.Schema.Types.ObjectId , 
                ref : "users"
            },
            text : {
                type : String,
                required : true
            },
            timestamps : {
                type : Date,
                default : Date.now()
            }
        }
    ]
},
{
    timestamps : true
}
);

const postModel = mongoose.model("post" , postSchema);

export default postModel;
import {body} from "express-validator"
import User from "../models/user.model.js"


export const signupValidation = [
    body("username").trim().notEmpty().withMessage("username is required").isLength({min : 3}).withMessage("username must be greater than 3 characters").isLength({max : 10}).withMessage("Username must be smaller than 10 characters")
    .custom(async (value) => {
        const isUser = await User.findOne({username : value})
        if(isUser){
            throw new Error("username already exists")
        }
    }).withMessage("username already exists... Try another username"),

    body("email").trim().toLowerCase().isEmail().withMessage("Invalid E-mail")
    .custom(async (value) => {
        const isEmailThere = await User.findOne({email : value});
        if (isEmailThere) {
            throw new Error("Email already exists");
        }
    }).withMessage("E-Mail already exists try to login ..."),

    body("password").trim().isLength({min:6}).withMessage("Password must be atleast 6 characters long")
]

export const loginValidation = [
    body("email").trim().toLowerCase().isEmail().withMessage("Invalid E-mail"),
    body("password").trim().notEmpty().withMessage("Password is required")
]
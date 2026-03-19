import jwt from 'jsonwebtoken';

const authmiddleware = (req,res,next) => {
    const token = req.cookies.token;

    if(!token){ //agar token undefined aaye 
        return res.status(400).json({message : "The user is not logged In"})
    }
    
    const decoded = jwt.verify(token , process.env.JWT_SECRET) //decoded mein payload aayega jisme user ka id hoga

    req.user = decoded.id;
    req.isGuest = decoded.isGuest

    // res.status(200).json({
    //     message : "The user is logged In aane do ussko "
    // });
    

    //middleware ke andar kabhi bhi res.send() ya res.json() nahi karna chahiye kyuki middleware ka kaam sirf request ko process karna aur next middleware ko call karna hota hai, agar hum res.send() ya res.json() karenge to response send ho jayega aur next middleware ya route handler ko control nahi milega, isliye hume next() call karna chahiye taaki control next middleware ya route handler ko mile.
    //The flow is as follows : 
    /*
    
    first the user will login and get the token in the cookie, then when the user tries to access a protected route, this middleware will check for the token in the cookie, if the token is not present, it will return an error message. If the token is present, it will verify the token and decode it to get the user id, then it will attach the user id to the request object and call next() to pass control to the next middleware or route handler.
    in my case it will pass to route handler which will throw user to the profile
    
    
    
    */


    next()
}


export default authmiddleware;
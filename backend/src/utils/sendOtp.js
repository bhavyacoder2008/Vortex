import nodemailer from "nodemailer"

const sendOtp = async (email,otp) => {
    try{console.log(process.env.EMAIL)
    console.log(process.env.EMAIL_PASS)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user : process.env.EMAIL,
            pass : process.env.EMAIL_PASS
        }
    })
    const mailOptions = {
        from : process.env.EMAIL,
        to : email,
        subject : "Your OTP for verification",
        html : `
                <p>Your OTP is <h1>${otp}</h1></p>
            `

    }

    await transporter.sendMail(mailOptions);}
    catch(err){
        console.log(err)
    }


}

export default sendOtp;
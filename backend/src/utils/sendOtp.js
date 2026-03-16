import nodemailer from "nodemailer"

const sendOtp = async (email,otp) => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL,
            pass : process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from : process.env.EMAIL,
        to : email,
        subject : "Your Vortex account OTP",
        text : `OTP to verify your E-mail is ${otp} , enter this otp to verify your e-mail...`
    })
}

export default sendOtp;
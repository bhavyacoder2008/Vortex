import nodemailer from "nodemailer"

const sendOtp = async (email,otp) => {
    try {
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
        console.log("OTP sent successfully to", email);
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error; // or handle as needed
    }
}

export default sendOtp;
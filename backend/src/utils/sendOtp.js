import nodemailer from "nodemailer"

const sendOtp = async (email,otp) => {
    console.log("EMAIL env set:", process.env.EMAIL ? "yes" : "no");
    console.log("EMAIL_PASS env set:", process.env.EMAIL_PASS ? "yes" : "no");

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your Vortex account OTP",
            text: `OTP to verify your E-mail is ${otp} , enter this otp to verify your e-mail...`
        });
        console.log("OTP sent successfully to", email);
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        throw error;
    }
}

export default sendOtp;
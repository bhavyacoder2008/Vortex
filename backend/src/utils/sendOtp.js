import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtp = async (email, otp) => {


    console.log(email)

    const res = await resend.emails.send({
        from: "onboarding@resend.dev", 
        to: email,
        subject: "Your OTP for verification",
        html: `<p>Your OTP is <h1>${otp}</h1></p>`
    });
    console.log(res)
    console.log("OTP Sent");
}

export default sendOtp;
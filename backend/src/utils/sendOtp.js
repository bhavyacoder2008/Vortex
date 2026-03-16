import sgMail from '@sendgrid/mail';

const sendOtp = async (email, otp) => {
    console.log("SENDGRID_API_KEY env set:", process.env.SENDGRID_API_KEY ? "yes" : "no");

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: email,
        from: process.env.EMAIL, // Make sure this is verified in SendGrid
        subject: 'Your Vortex account OTP',
        text: `OTP to verify your E-mail is ${otp}, enter this otp to verify your e-mail...`,
    };

    try {
        const result = await sgMail.send(msg);
        console.log("OTP sent successfully to", email, "SendGrid response:", result);
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        throw error;
    }
};

export default sendOtp;
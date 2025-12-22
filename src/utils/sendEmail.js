const nodeMailer = require("nodemailer");



const sendEmail = async(to,passwordResetToken)=>
{
try{
    //create transport 
    const transport = nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:"rajusheikh2005@gmail.com",
            pass:process.env.GOOGLE_APP_PASSWORD
        }
    });
    //create message to send email
    const message  = {
        to,
        subject:"forget password token",
        html:`<p>You are receiving this email because you (or someone else) have requested to forget password token</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>https://localhost:3000/reset-password/${passwordResetToken}</p>
        <p>If you did not request this, please ignore this email.</p> `
    }
    //send to email
    const info = await transport.sendMail(message);
    console.log("email send : ",info.messageId);

}catch(err)
{
    console.log("ERROR : ",err);
    throw new Error(err.message);
}

}

module.exports = sendEmail;
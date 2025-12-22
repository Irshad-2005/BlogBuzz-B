const nodeMailer = require("nodemailer");

const sendAccountVerificationEmail = async(to,accountVerificationToken)=>
{
    try{

    
    //create a transport
    const transport = nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:
        {
            user:"rajusheikh2005@gmail.com",
            pass:process.env.GOOGLE_APP_PASSWORD
        }
    });

    //create a message to pass gmail
    const message = {
        to,
        subject:"Account verification token",
        html:`<p>You are receiving this email because you (or someone else) have requested to your account verification token</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>https://localhost:3000/account-verification/${accountVerificationToken}</p>
        <p>If you did not request this, please ignore this email.</p>`
    }
    // send the email
    const info = await transport.sendMail(message);
    console.log("send email : ",info.messageId);
}catch(err)
{
    console.log("ERROR : ",err.message);
    throw new Error(err.message);
}
}

module.exports = sendAccountVerificationEmail;
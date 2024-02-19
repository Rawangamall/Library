const accountSid =  process.env.AccountSID;
const authToken = process.env.AccountToken;
const verifySid = "VAee0117c465422c00f7ed46e32a6264fe";
const client = require("twilio")(accountSid, authToken);

export const sendSMS = async function sendVerificationCode(phoneNumber:number) {   //in trial mood allow phoneverified in my acc only but in the paid all is allowed 👍
    try {

        const verification = await client.verify.v2
            .services(verifySid)
            .verifications.create({ to: "+201022887277", channel: "sms" }); // to phoneNumber
        console.log(verification.status); 
        return true;
    } catch (error) {
        console.error(`Error sending verification code: ${error}`);
        return false; 
    }
};

// Function to handle user verification using Twilio
export const verifyUser = async function verifyUserOTP(phoneNumber:number, otpCode:number) {
    try {
        const verificationCheck = await client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: "+201022887277", code: otpCode });  //to phoneNumber
        console.log(verificationCheck.status,"sms"); 
        return verificationCheck.status === 'approved'; 
    } catch (error) {
        console.error(`Error verifying OTP: ${error}`);
        return false; 
    }
};


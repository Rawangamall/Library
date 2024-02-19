"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.sendSMS = void 0;
const accountSid = process.env.AccountSID;
const authToken = process.env.AccountToken;
const verifySid = "VAee0117c465422c00f7ed46e32a6264fe";
const client = require("twilio")(accountSid, authToken);
const sendSMS = function sendVerificationCode(phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const verification = yield client.verify.v2
                .services(verifySid)
                .verifications.create({ to: "+201022887277", channel: "sms" }); // to phoneNumber
            console.log(verification.status);
            return true;
        }
        catch (error) {
            console.error(`Error sending verification code: ${error}`);
            return false;
        }
    });
};
exports.sendSMS = sendSMS;
// Function to handle user verification using Twilio
const verifyUser = function verifyUserOTP(phoneNumber, otpCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const verificationCheck = yield client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: "+201022887277", code: otpCode }); //to phoneNumber
            console.log(verificationCheck.status, "sms");
            return verificationCheck.status === 'approved';
        }
        catch (error) {
            console.error(`Error verifying OTP: ${error}`);
            return false;
        }
    });
};
exports.verifyUser = verifyUser;

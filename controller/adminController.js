const Admin = require("../model/adminSchema");
const { uid } = require("uid")
const { sendOTPEmail, sendPasswordResetConfirmation } = require("../utils/emailService");
let otp;
let adminMail;

const adminController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const isExist = await Admin.findOne({ email: email, password: password });
            if (!isExist) {
                return res.json({ success: false })
            }
            res.json({ success: true })
        } catch (error) {
            res.json({ message: false })
        }
    },
    submitForgetPassMail: async (req, res) => {
        try {
            const { forgetPasswordEmail } = req.body;
            adminMail = forgetPasswordEmail;
            const adminDataCollection = await Admin.findOne({ email: forgetPasswordEmail });

            if (!adminDataCollection) {
                return res.json({ success: false, error: "email doesnt exist" })
            }

            otp = uid(6)
            await sendOTPEmail(forgetPasswordEmail, otp);


            res.json({ success: true, message: "please check your email. You will get an OTP" })

        } catch (error) {
            res.json({ error: "something went wrong. Please try again", success: false })
        }
    },
    submitForgetPassOTP: async (req, res) => {
        try {
            const { resetOTP } = req.body;

            if (otp === resetOTP) {
                return res.json({ success: true })
            }
            return res.json({ success: false, otp, resetOTP })

        } catch (error) {
            res.json({ success: false, error: "Something went wrong. Please try again" })
        }
    },
    resetPass: async (req, res) => {
        try {
            const { newPass, confirmNewPass } = req.body;

            if (newPass === confirmNewPass) {
                const passChanged = await Admin.findOneAndUpdate(
                    { email: adminMail },
                    { password: newPass },
                    { new: true }
                )
                if (passChanged) {
                    // Using a simple notification for now, or I could add another method to emailService
                    console.log(`Password reset for ${adminMail}`);
                    return res.json({ success: true, message: "Password updated" })
                }

            }
            res.json({ success: false, error: "something went wrong. Please try again", adminMail })
        } catch (error) {
            res.json({ success: false, error: "Something went wrong." })
        }
    }



}

module.exports = adminController 
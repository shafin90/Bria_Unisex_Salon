const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'shafinahnam89@gmail.com',
        pass: 'etoytxvjxixpooow'
    }
});

const sendBookingConfirmationEmail = async (email, name, booking, pdfBuffer) => {
    try {
        await transporter.sendMail({
            from: 'shafinahnam89@gmail.com',
            to: email,
            subject: 'Bria Salon - Booking Confirmation & Entry Token',
            html: `
            <h1>Thank you for your booking, ${name}!</h1>
            <p>Your appointment at Bria Salon is confirmed.</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Confirmation Code:</strong> ${booking.confirmationCode}</p>
            <p>Please find your entry token attached to this email. You will need to show this at the salon.</p>
            <p>See you soon!</p>
            <p>Bria Unisex Salon</p>
            `,
            attachments: [
                {
                    filename: `Bria-Salon-Token-${booking.confirmationCode}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
};

const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: 'shafinahnam89@gmail.com',
            to: email,
            subject: 'Reset Password OTP',
            html: `<h1>Your OTP: ${otp}</h1>`
        });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

module.exports = { sendBookingConfirmationEmail, sendOTPEmail };

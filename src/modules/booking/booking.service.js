const bookingRepository = require('./booking.repository');
const { uid } = require("uid");
const User = require('../user/user.model'); // Cross-module dependency
const Service = require('../service/service.model'); // Cross-module dependency (to be created)
const { generateBookingTicket } = require('../../utils/pdfGenerator');
const { sendBookingConfirmationEmail } = require('../../utils/emailService');

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

const bookingService = {
    createBooking: async (bookingData) => {
        const { name, phoneNumber, service, date, time, email } = bookingData;
        
        const bookingTimeSlice = time[0] == 0 ? time.substring(1) : time;
        const confirmationCode = uid(6);
        
        const bookingAdded = await bookingRepository.create({
            name,
            phoneNumber: phoneNumber.slice(1),
            service,
            date,
            time: bookingTimeSlice,
            confirmationCode
        });

        if (!bookingAdded) throw new Error("Booking incomplete");

        // User logic
        let user = await User.findOne({ name, phoneNumber });
        if (!user) {
            user = new User({ name, phoneNumber });
            await user.save();
        }

        const newRepetitions = (user.howMuchRepeat || 0) + 1;
        const bookingDate = formatDate(new Date());
        const bookingTime = formatTime(new Date());

        const lastAppearanceDate = {
            date: bookingDate,
            time: bookingTime
        };

        let totalSpentByUser = user.totalSpent || 0;

        for (const item of service) {
            const serviceDetails = await Service.findOne({ serviceName: item.serviceName });
            if (serviceDetails) {
                await Service.findOneAndUpdate(
                    { serviceName: item.serviceName }, 
                    { $inc: { bookingCount: 1 } }
                );
                totalSpentByUser += item.servicePrice;
            }
        }

        await User.findOneAndUpdate(
            { name, phoneNumber }, 
            { 
                howMuchRepeat: newRepetitions, 
                lastAppearanceDate, 
                totalSpent: totalSpentByUser,
                isRepeat: newRepetitions > 1
            }
        );

        // PDF and Email
        const pdfBuffer = await generateBookingTicket(bookingAdded);
        if (email) {
            await sendBookingConfirmationEmail(email, name, bookingAdded, pdfBuffer);
        }

        return bookingAdded;
    },
    getBookings: async (page, limit) => {
        const skip = (page - 1) * limit;
        const bookings = await bookingRepository.findAll(skip, limit);
        const total = await bookingRepository.count();
        return {
            bookings,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    getRecent: async () => {
        return await bookingRepository.findRecent();
    },
    getParticular: async (phoneNumber) => {
        const userBookings = await bookingRepository.findByPhoneNumber(phoneNumber);
        return userBookings[0] || null;
    },
    getById: async (id) => {
        return await bookingRepository.findById(id);
    }
};

module.exports = bookingService;

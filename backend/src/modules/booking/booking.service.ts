import bookingRepository  from './booking.repository';
import { uid }  from 'uid';
import User  from '../user/user.model'; // Cross-module dependency
import Service  from '../service/service.model'; // Cross-module dependency (to be created)
import { generateBookingTicket }  from '../../utils/pdfGenerator';
import { sendBookingConfirmationEmail }  from '../../utils/emailService';

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
    createBooking: async (bookingData, tenantId) => {
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
        }, tenantId);

        if (!bookingAdded) throw new Error("Booking incomplete");

        // User logic
        let user = await User.findOne({ where: { name, phoneNumber, tenantId } });
        if (!user) {
            user = await User.create({ name, phoneNumber, tenantId });
        }

        const newRepetitions = ((user as any).howMuchRepeat || 0) + 1;
        const bookingDate = formatDate(new Date());
        const bookingTime = formatTime(new Date());

        const lastAppearanceDate = {
            date: bookingDate,
            time: bookingTime
        };

        let totalSpentByUser = (user as any).totalSpent || 0;

        for (const item of service) {
            const serviceDetails = await Service.findOne({ where: { serviceName: item.serviceName, tenantId } });
            if (serviceDetails) {
                await Service.update(
                    { bookingCount: (serviceDetails as any).bookingCount + 1 },
                    { where: { id: (serviceDetails as any).id, tenantId } }
                );
                totalSpentByUser += item.servicePrice;
            }
        }

        await User.update(
            { 
                howMuchRepeat: newRepetitions, 
                lastAppearanceDate, 
                totalSpent: totalSpentByUser,
                isRepeat: newRepetitions > 1
            },
            { where: { id: (user as any).id, tenantId } }
        );

        // PDF and Email
        const pdfBuffer = await generateBookingTicket(bookingAdded);
        if (email) {
            await sendBookingConfirmationEmail(email, name, bookingAdded, pdfBuffer);
        }

        return bookingAdded;
    },
    getBookings: async (page, limit, tenantId) => {
        const skip = (page - 1) * limit;
        const bookings = await bookingRepository.findAll(skip, limit, tenantId);
        const total = await bookingRepository.count(tenantId);
        return {
            bookings,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    getRecent: async (tenantId) => {
        return await bookingRepository.findRecent(tenantId);
    },
    getParticular: async (phoneNumber, tenantId) => {
        const userBookings = await bookingRepository.findByPhoneNumber(phoneNumber, tenantId);
        return userBookings[0] || null;
    },
    getById: async (id, tenantId) => {
        return await bookingRepository.findById(id, tenantId);
    }
};

export default bookingService;

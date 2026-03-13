import Booking  from '../booking/booking.model';
import User  from '../user/user.model';
import Service  from '../service/service.model';
import convertToDate  from './dashboard.utils';

const dashboardService = {
    getDashboardStats: async () => {
        const allService: any[] = await Service.findAll();
        const allBookings: any[] = await Booking.findAll();

        let totalRevenue = 0;
        let totalBookings = 0;

        for (const service of allService) {
            totalRevenue += (service.price * (service.bookingCount || 0));
            totalBookings += (service.bookingCount || 0);
        }

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentBookings = allBookings.filter(booking => {
            const bookingDate = convertToDate(booking.date);
            return bookingDate >= twentyFourHoursAgo && bookingDate <= now;
        });

        const lastThirtyDaysBookings = allBookings.filter(booking => {
            const bookingDate = convertToDate(booking.date);
            return bookingDate >= thirtyDaysAgo && bookingDate <= now;
        });

        let lastThirtyDaysRevenue = 0;
        for (const booking of lastThirtyDaysBookings) {
            if (booking.service) {
                for (const item of booking.service) {
                    lastThirtyDaysRevenue += (item.servicePrice || 0);
                }
            }
        }

        const recentBookingCount = recentBookings.length;
        const lastThirtyDaysBookingCount = lastThirtyDaysBookings.length;

        const revenueDeviation = parseFloat(((lastThirtyDaysRevenue / totalRevenue) * 100).toFixed(2)) || 0;
        const bookingDeviation = parseFloat(((lastThirtyDaysBookingCount / totalBookings) * 100).toFixed(2)) || 0;
        const recentBookingCountDeviation = (recentBookingCount / lastThirtyDaysBookingCount) * 100 || 0;

        return {
            totalRevenue,
            totalBookings,
            activeSession: recentBookingCount,
            revenueDeviation,
            bookingDeviation,
            recentBookingCountDeviation
        };
    },
    getGraphData: async () => {
        const allUser = await User.findAll();
        const allBooking: any[] = await Booking.findAll();

        let graphData: any[] = [];

        for (const booking of allBooking) {
            const findingParticularUser = allUser.find((user: any) => user.phoneNumber == `+${(booking as any).phoneNumber}`);
            const isRepeat = findingParticularUser ? (findingParticularUser as any).isRepeat : false;

            graphData.push({
                isRepeat,
                date: booking.date,
                time: booking.time.toUpperCase()
            });
        }

        return graphData;
    }
};

export default dashboardService;

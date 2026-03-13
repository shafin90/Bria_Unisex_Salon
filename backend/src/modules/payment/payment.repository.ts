import Payment  from './payment.model';
import Booking  from '../booking/booking.model';
import User  from '../user/user.model';
import Stylist  from '../stylist/stylist.model';

const paymentRepository = {
    create: async (data, tenantId) => {
        return await Payment.create({ ...data, tenantId });
    },
    findAll: async (tenantId) => {
        return await Payment.findAll({
            where: { tenantId },
            include: [Booking, User, Stylist]
        });
    }
};

export default paymentRepository;

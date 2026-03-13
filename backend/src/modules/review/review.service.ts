import reviewRepository  from './review.repository';
import Booking  from '../booking/booking.model';

const reviewService = {
    submitReview: async (reviewData, tenantId) => {
        const { phoneNumber } = reviewData;
        
        // Customer validation scoped to tenant
        const existingBooking = await Booking.findOne({ where: { phoneNumber, tenantId } });
        if (!existingBooking) {
            throw new Error("Please book our services first before leaving a review");
        }

        const existingReview = await reviewRepository.findOne({ phoneNumber }, tenantId);
        if (existingReview) {
            throw new Error("You have already submitted a review with this phone number");
        }

        return await reviewRepository.create(reviewData, tenantId);
    },
    getAll: async (page, limit, tenantId) => {
        const skip = (page - 1) * limit;
        const reviews = await reviewRepository.findAll(skip, limit, tenantId);
        const total = await reviewRepository.count({}, tenantId);
        return {
            reviews,
            totalReviews: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    getApproved: async (page, limit, tenantId) => {
        const skip = (page - 1) * limit;
        const reviews = await reviewRepository.findApproved(skip, limit, tenantId);
        const total = await reviewRepository.count({ isApproved: true }, tenantId);
        return {
            reviews,
            totalReviews: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    approveReview: async (id, tenantId) => {
        return await reviewRepository.findByIdAndUpdate(id, { isApproved: true, approvedAt: new Date() }, tenantId);
    },
    deleteReview: async (id, tenantId) => {
        return await reviewRepository.findByIdAndDelete(id, tenantId);
    },
    getStats: async (tenantId) => {
        const total = await reviewRepository.count({}, tenantId);
        const approved = await reviewRepository.count({ isApproved: true }, tenantId);
        const pending = await reviewRepository.count({ isApproved: false }, tenantId);

        const avgRatingResult = await reviewRepository.aggregate(tenantId);

        const ratingDistribution = await reviewRepository.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        return {
            totalReviews: total,
            approvedReviews: approved,
            pendingReviews: pending,
            averageRating: avgRatingResult.length > 0 ? Math.round((avgRatingResult[0] as any).avgRating * 10) / 10 : 0,
            ratingDistribution
        };
    }
};

export default reviewService;

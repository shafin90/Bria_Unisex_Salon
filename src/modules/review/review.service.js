const reviewRepository = require('./review.repository');
const Booking = require('../booking/booking.model');

const reviewService = {
    submitReview: async (reviewData) => {
        const { phoneNumber } = reviewData;
        
        // Customer validation
        const existingBooking = await Booking.findOne({ phoneNumber });
        if (!existingBooking) {
            throw new Error("Please book our services first before leaving a review");
        }

        const existingReview = await reviewRepository.findOne({ phoneNumber });
        if (existingReview) {
            throw new Error("You have already submitted a review with this phone number");
        }

        return await reviewRepository.create(reviewData);
    },
    getAll: async (page, limit) => {
        const skip = (page - 1) * limit;
        const reviews = await reviewRepository.findAll(skip, limit);
        const total = await reviewRepository.count();
        return {
            reviews,
            totalReviews: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    getApproved: async (page, limit) => {
        const skip = (page - 1) * limit;
        const reviews = await reviewRepository.findApproved(skip, limit);
        const total = await reviewRepository.count({ isApproved: true });
        return {
            reviews,
            totalReviews: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    },
    approveReview: async (id) => {
        return await reviewRepository.findByIdAndUpdate(id, { isApproved: true, approvedAt: new Date() });
    },
    deleteReview: async (id) => {
        return await reviewRepository.findByIdAndDelete(id);
    },
    getStats: async () => {
        const total = await reviewRepository.count();
        const approved = await reviewRepository.count({ isApproved: true });
        const pending = await reviewRepository.count({ isApproved: false });

        const avgRatingResult = await reviewRepository.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);

        const ratingDistribution = await reviewRepository.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        return {
            totalReviews: total,
            approvedReviews: approved,
            pendingReviews: pending,
            averageRating: avgRatingResult.length > 0 ? Math.round(avgRatingResult[0].avgRating * 10) / 10 : 0,
            ratingDistribution
        };
    }
};

module.exports = reviewService;

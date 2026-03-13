const Review = require('./review.model');
const { sequelize } = require('../../config/db');

const reviewRepository = {
    create: async (data) => {
        return await Review.create(data);
    },
    findAll: async (skip, limit) => {
        return await Review.findAll({ 
            order: [['submittedAt', 'DESC']],
            offset: skip,
            limit: limit
        });
    },
    count: async (query = {}) => {
        return await Review.count({ where: query });
    },
    findApproved: async (skip, limit) => {
        return await Review.findAll({ 
            where: { isApproved: true },
            order: [['approvedAt', 'DESC']],
            offset: skip,
            limit: limit
        });
    },
    findByIdAndUpdate: async (id, data) => {
        const review = await Review.findByPk(id);
        if (review) {
            return await review.update(data);
        }
        return null;
    },
    findByIdAndDelete: async (id) => {
        return await Review.destroy({ where: { id } });
    },
    findOne: async (query) => {
        return await Review.findOne({ where: query });
    },
    aggregate: async (pipeline) => {
        // Simple implementation for average rating since that's what's usually needed
        const stats = await Review.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });
        return stats;
    }
};

module.exports = reviewRepository;

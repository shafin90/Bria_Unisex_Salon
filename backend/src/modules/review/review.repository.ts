import Review  from './review.model';
import { sequelize }  from '../../config/db';

const reviewRepository = {
    create: async (data, tenantId) => {
        return await Review.create({ ...data, tenantId });
    },
    findAll: async (skip, limit, tenantId) => {
        return await Review.findAll({ 
            where: { tenantId },
            order: [['submittedAt', 'DESC']],
            offset: skip,
            limit: limit
        });
    },
    count: async (query = {}, tenantId) => {
        return await Review.count({ where: { ...query, tenantId } });
    },
    findApproved: async (skip, limit, tenantId) => {
        return await Review.findAll({ 
            where: { isApproved: true, tenantId },
            order: [['approvedAt', 'DESC']],
            offset: skip,
            limit: limit
        });
    },
    findByIdAndUpdate: async (id, data, tenantId) => {
        const review = await Review.findOne({ where: { id, tenantId } });
        if (review) {
            return await review.update(data);
        }
        return null;
    },
    findByIdAndDelete: async (id, tenantId) => {
        return await Review.destroy({ where: { id, tenantId } });
    },
    findOne: async (query, tenantId) => {
        return await Review.findOne({ where: { ...query, tenantId } });
    },
    aggregate: async (tenantId) => {
        // Simple implementation for average rating since that's what's usually needed
        const stats = await Review.findAll({
            where: { tenantId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });
        return stats;
    }
};

export default reviewRepository;

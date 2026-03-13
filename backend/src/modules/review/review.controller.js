const reviewService = require('./review.service');
const fs = require('fs');
const path = require('path');

const reviewController = {
    addReview: async (req, res) => {
        try {
            const { name, phoneNumber, review, rating } = req.body;
            const photo = req.file ? `/uploads/reviews/${req.file.filename}` : '';

            if (!name || !phoneNumber || !review || !rating) {
                return res.status(400).json({ success: false, message: "Please fill all required fields" });
            }

            const savedReview = await reviewService.submitReview({
                name,
                phoneNumber,
                photo,
                review,
                rating: parseInt(rating),
                isApproved: false
            });

            res.status(201).json({
                success: true,
                message: "Review submitted successfully. It will be published after admin approval.",
                review: savedReview
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    getAllReviews: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await reviewService.getAll(page, limit);
            res.json({ success: true, ...result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getApprovedReviews: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const result = await reviewService.getApproved(page, limit);
            res.json({ success: true, ...result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    approveReview: async (req, res) => {
        try {
            const { id } = req.params;
            const review = await reviewService.approveReview(id);
            if (!review) return res.status(404).json({ success: false, message: "Review not found" });
            res.json({ success: true, message: "Review approved successfully", review });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params;
            const review = await reviewService.deleteReview(id);
            if (!review) return res.status(404).json({ success: false, message: "Review not found" });

            if (review.photo) {
                const photoPath = path.join(__dirname, '../../../', review.photo);
                if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
            }
            res.json({ success: true, message: "Review deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getReviewStats: async (req, res) => {
        try {
            const stats = await reviewService.getStats();
            res.json({ success: true, stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = reviewController;

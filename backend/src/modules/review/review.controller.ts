import reviewService  from './review.service';
import fs  from 'fs';
import path  from 'path';

const reviewController = {
    addReview: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

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
            }, tenantId);

            res.status(201).json({
                success: true,
                message: "Review submitted successfully. It will be published after admin approval.",
                review: savedReview
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    getAllReviews: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await reviewService.getAll(page, limit, tenantId);
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getApprovedReviews: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const result = await reviewService.getApproved(page, limit, tenantId);
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    approveReview: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { id } = req.params;
            const review = await reviewService.approveReview(id, tenantId);
            if (!review) return res.status(404).json({ success: false, message: "Review not found" });
            res.json({ success: true, message: "Review approved successfully", review });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteReview: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.body.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const { id } = req.params;
            const review: any = await reviewService.getApproved(1, 1, tenantId); // Hacky way to check, ideally we need getReviewById
            const deletedCount = await reviewService.deleteReview(id, tenantId);
            if (!deletedCount) return res.status(404).json({ success: false, message: "Review not found" });

            if (review.photo) {
                const photoPath = path.join(__dirname, '../../../', review.photo);
                if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
            }
            res.json({ success: true, message: "Review deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getReviewStats: async (req, res) => {
        try {
            const tenantId = req.tenantId || req.query.tenantId;
            if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

            const stats = await reviewService.getStats(tenantId);
            res.json({ success: true, stats });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export default reviewController;

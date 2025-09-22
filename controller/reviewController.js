const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Review = require('../model/reviewSchema');
const Booking = require('../model/bookingSchema');

// Configure multer for local storage (temporary solution)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/reviews');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

const reviewController = {
    // Add a new review
    addReview: async (req, res) => {
        try {
            const { name, phoneNumber, review, rating } = req.body;
            const photo = req.file ? `/uploads/reviews/${req.file.filename}` : '';

            // Validate required fields
            if (!name || !phoneNumber || !review || !rating) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Please fill all required fields" 
                });
            }

            // Validate rating
            const ratingNum = parseInt(rating);
            if (ratingNum < 1 || ratingNum > 5) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Rating must be between 1 and 5" 
                });
            }

            // Check if phoneNumber exists in bookings (customer validation)
            const existingBooking = await Booking.findOne({ phoneNumber: phoneNumber });
            if (!existingBooking) {
                return res.status(400).json({
                    success: false,
                    message: "Please book our services first before leaving a review",
                    code: "CUSTOMER_NOT_FOUND"
                });
            }

            // Check if user already submitted a review with this phone number
            const existingReview = await Review.findOne({ phoneNumber: phoneNumber });
            if (existingReview) {
                return res.status(400).json({
                    success: false,
                    message: "You have already submitted a review with this phone number",
                    code: "REVIEW_EXISTS"
                });
            }

            // Create new review
            const newReview = new Review({
                name,
                phoneNumber,
                photo,
                review,
                rating: ratingNum,
                isApproved: false
            });

            const savedReview = await newReview.save();

            res.status(201).json({
                success: true,
                message: "Review submitted successfully. It will be published after admin approval.",
                review: savedReview
            });

        } catch (error) {
            console.error('Error in addReview:', error);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    },

    // Get all reviews (for admin)
    getAllReviews: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const reviews = await Review.find()
                .sort({ submittedAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalReviews = await Review.countDocuments();

            res.json({
                success: true,
                totalReviews,
                totalPages: Math.ceil(totalReviews / limit),
                currentPage: page,
                reviews
            });

        } catch (error) {
            console.error('Error in getAllReviews:', error);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    },

    // Get approved reviews (for public display)
    getApprovedReviews: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const skip = (page - 1) * limit;

            const reviews = await Review.find({ isApproved: true })
                .sort({ approvedAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalApprovedReviews = await Review.countDocuments({ isApproved: true });

            res.json({
                success: true,
                totalReviews: totalApprovedReviews,
                totalPages: Math.ceil(totalApprovedReviews / limit),
                currentPage: page,
                reviews
            });

        } catch (error) {
            console.error('Error in getApprovedReviews:', error);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    },

    // Approve a review
    approveReview: async (req, res) => {
        try {
            const { id } = req.params;

            const review = await Review.findByIdAndUpdate(
                id,
                { 
                    isApproved: true,
                    approvedAt: new Date()
                },
                { new: true }
            );

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: "Review not found"
                });
            }

            res.json({
                success: true,
                message: "Review approved successfully",
                review
            });

        } catch (error) {
            console.error('Error in approveReview:', error);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    },

    // Reject/Delete a review
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params;

            const review = await Review.findByIdAndDelete(id);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: "Review not found"
                });
            }

            // Delete photo from local storage if exists
            if (review.photo) {
                const photoPath = path.join(__dirname, '..', review.photo);
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            }

            res.json({
                success: true,
                message: "Review deleted successfully"
            });

        } catch (error) {
            console.error('Error in deleteReview:', error);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    },

    // Get review statistics
    getReviewStats: async (req, res) => {
        try {
            const totalReviews = await Review.countDocuments();
            const approvedReviews = await Review.countDocuments({ isApproved: true });
            const pendingReviews = await Review.countDocuments({ isApproved: false });

            // Calculate average rating
            const avgRatingResult = await Review.aggregate([
                { $match: { isApproved: true } },
                { $group: { _id: null, avgRating: { $avg: "$rating" } } }
            ]);

            const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

            // Get rating distribution
            const ratingDistribution = await Review.aggregate([
                { $match: { isApproved: true } },
                { $group: { _id: "$rating", count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);

            res.json({
                success: true,
                stats: {
                    totalReviews,
                    approvedReviews,
                    pendingReviews,
                    averageRating: Math.round(averageRating * 10) / 10,
                    ratingDistribution
                }
            });

        } catch (error) {
            console.error('Error in getReviewStats:', error);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message
            });
        }
    }
};

module.exports = { reviewController, upload };

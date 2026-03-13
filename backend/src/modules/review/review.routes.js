const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const upload = require('./review.upload');

router.post('/addReview', upload.single('photo'), reviewController.addReview);
router.get('/getAllReviews', reviewController.getAllReviews);
router.get('/getApprovedReviews', reviewController.getApprovedReviews);
router.put('/approveReview/:id', reviewController.approveReview);
router.delete('/deleteReview/:id', reviewController.deleteReview);
router.get('/getReviewStats', reviewController.getReviewStats);

module.exports = router;

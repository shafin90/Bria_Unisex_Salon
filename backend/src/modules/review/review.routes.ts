import express  from 'express';
const router = express.Router();
import reviewController  from './review.controller';
import upload  from './review.upload';

router.post('/addReview', upload.single('photo'), reviewController.addReview);
router.get('/getAllReviews', reviewController.getAllReviews);
router.get('/getApprovedReviews', reviewController.getApprovedReviews);
router.put('/approveReview/:id', reviewController.approveReview);
router.delete('/deleteReview/:id', reviewController.deleteReview);
router.get('/getReviewStats', reviewController.getReviewStats);

export default router;

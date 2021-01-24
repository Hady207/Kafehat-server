import { Router } from 'express';
import { authController, reviewController } from '../controllers';

const router = Router();

router.use(authController.protect);

// general reviews routes
router
  .route('/:cafeId')
  .post(reviewController.lockReviewToUser, reviewController.createReview)
  .get(reviewController.getReviews);

// review specific routes
router
  .route('/:reviewId')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

router.post('/:cafeId/comments', reviewController.commentOnReview);

export default router;

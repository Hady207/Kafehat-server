import { ReviewServices } from '../services';
import catchAsync from '../utils/catchAsync';

const reviewService = new ReviewServices();

const reviewRespond = (res, statuscode, doc) =>
  res.status(statuscode).json({
    status: 'success',
    [Array.isArray(doc) && 'count']: doc.length,
    result: {
      data: doc,
    },
  });

exports.lockReviewToUser = (req, res, next) => {
  req.body.user = req.user.id;
  req.body.cafe = req.params.cafeId;
  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, user, cafe } = req.body;
  const createdReview = await reviewService.createReview({
    review,
    rating,
    user,
    cafe,
  });
  reviewRespond(res, 201, createdReview);
});

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewService.getAllReviewsCafe(req.params.cafeId);
  reviewRespond(res, 200, reviews);
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const updatedReview = await reviewService.updateReview(
    req.params.reviewId,
    req.body
  );
  reviewRespond(res, 202, updatedReview);
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const deleteReview = await reviewService.deleteReview(req.params.reviewId);
  reviewRespond(res, 204, deleteReview);
});

exports.commentOnReview = catchAsync(async (req, res, next) => {});

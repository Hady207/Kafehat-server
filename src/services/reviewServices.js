import Review from '../models/Review';

export default class reviewServices {
  async getAllReviewsCafe(cafeId) {
    const reviews = await Review.find({ cafe: cafeId });
    return reviews;
  }

  async getAllReviewsUser(userId) {
    const reviews = await Review.find({ user: userId });
    return reviews;
  }

  async createReview(content) {
    const createdReview = Review.create(content);
    return createdReview;
  }

  async updateReview(id, content) {
    const updatedReview = Review.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
    });
    return updatedReview;
  }

  async deleteReview(id) {
    const deleteReview = Review.findByIdAndDelete(id);
    return deleteReview;
  }
}

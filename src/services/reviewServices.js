import Review from '../models/Review';

export default class reviewServices {
  async getAllReviewsCafe(cafeId) {
    try {
      const reviews = await Review.find({ cafe: cafeId });
      return reviews;
    } catch (error) {
      return error;
    }
  }

  async getAllReviewsUser(userId) {
    try {
      const reviews = await Review.find({ user: userId });
      return reviews;
    } catch (error) {
      return error;
    }
  }

  async createReview(content) {
    try {
      const createdReview = Review.create(content);
      return createdReview;
    } catch (error) {
      return error;
    }
  }

  async updateReview(id, content) {
    try {
      const updatedReview = Review.findByIdAndUpdate(id, content, {
        new: true,
        runValidators: true,
      });
      return updatedReview;
    } catch (error) {
      return error;
    }
  }

  async deleteReview(id) {
    try {
      const deleteReview = Review.findByIdAndDelete(id);
      return deleteReview;
    } catch (error) {
      return error;
    }
  }
}

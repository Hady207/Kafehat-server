import mongoose from 'mongoose';
import Cafe from './Cafe';

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty!'] },
    rating: { type: Number, required: true, min: 1, max: 5 },
    cafe: {
      type: mongoose.Schema.ObjectId,
      ref: 'Cafe',
      required: [true, 'Review must belong to a cafe'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImage ',
  });
  // this.populate('user', 'name');
  return next();
});

// statics methods are called on the model
reviewSchema.statics.calcAverageRatings = async function (cafeId) {
  const stats = await this.aggregate([
    {
      $match: { cafe: cafeId },
    },
    {
      $group: {
        _id: '$cafe',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Cafe.findByIdAndUpdate(universityId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Cafe.findByIdAndUpdate(universityId, {
      ratingsQuantity: 0,
      ratingsAverage: 3.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  // this constructor = MODEL
  this.constructor.calcAverageRatings(this.university);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.university);
});

export default mongoose.model('Review', reviewSchema);

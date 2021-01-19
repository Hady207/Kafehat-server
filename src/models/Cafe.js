import mongoose from 'mongoose';
import slugfiy from 'slugify';

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const cafeSchema = new mongoose.Schema({
  primaryImage: { type: String },
  name: { type: String, required: true },
  slug: { type: String },
  album: {
    type: [String],
  },
  desc: {
    type: String,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  ratingAverage: {
    type: Number,
    default: 3.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.66666, 47, 4.7
  },

  location: [pointSchema],
});

cafeSchema.pre('save', function (next) {
  this.slug = slugfiy(this.name, { lower: true });
  next();
});

cafeSchema.methods.LikeList = async function (userId) {
  if (this.likedBy.includes(userId)) {
    this.likedBy.pull(userId);
  } else {
    this.likedBy.push(userId);
  }
  return this.save({ validateBeforeSave: false });
};

export default mongoose.model('Cafe', cafeSchema, 'cafes');

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
  description: String,
});

// pointSchema.index({ index: '2dsphere' }); // Create a special 2dsphere index on `City.location`

const cafeSchema = new mongoose.Schema(
  {
    primaryImage: { type: String },
    name: { type: String, required: true },
    nameAr: { type: String },
    slug: { type: String },
    phone: { type: String },
    email: { type: String },
    album: {
      type: [String],
    },
    desc: {
      type: String,
    },
    descAr: {
      type: String,
    },
    promoCodes: [String],
    discounts: String,
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cafeSchema.index({ slug: 1 });
cafeSchema.index({ location: '2dsphere' });

// VIRTUAL POPULATE
cafeSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'cafe', //name of the field in the other model
  localField: '_id',
});

// VIRTUAL POPULATE
cafeSchema.virtual('menu', {
  ref: 'Menu',
  foreignField: 'cafe', //name of the field in the other model
  localField: '_id',
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

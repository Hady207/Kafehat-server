import mongoose from 'mongoose';
import Cafe from './Cafe';

const favoriteSchema = new mongoose.Schema(
  {
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

export default mongoose.model('Favorite', favoriteSchema);

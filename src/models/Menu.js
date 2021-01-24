import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  image: String,
  desc: String,
  descAr: String,
  price: String,
  priceDiscounted: Number,
});

const menuSchema = new mongoose.Schema({
  cafe: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cafe',
  },
  menu: {
    type: Map,
    of: [categorySchema],
  },
});

export default mongoose.model('Menu', menuSchema);

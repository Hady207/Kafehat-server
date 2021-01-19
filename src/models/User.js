import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

const userSchema = new mongoose.Schema(
  {
    profileImage: String,
    username: String,
    phoneNumber: String,
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      minlength: 8,
      select: false,
    },
    email: String,
    favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: [true, 'id must belong to a cafe'],
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin', 'superAdmin'],
      default: 'user',
    },
    location: [pointSchema],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// // virtuals
// userSchema.virtual('favorites', {
//   ref: 'Favorite',
//   localField: '_id',
//   foreignField: 'user',
// });

userSchema.pre('save', async function (next) {
  // Only run this function if password is actually modified
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'favorites',
//     select: 'name',
//   });

//   return next();
// });

userSchema.methods.FavoriteList = async function (cafeId) {
  if (this.favorites.includes(cafeId)) {
    this.favorites.pull(cafeId);
  } else {
    this.favorites.push(cafeId);
  }
  return this.save({ validateBeforeSave: false });
};

userSchema.methods.correctPassword = async function (
  bodyPassword,
  userPassword
) {
  return bcrypt.compare(bodyPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; //100<300
  }
  return false;
};

export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

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

pointSchema.index({ index: '2dsphere' }); // Create a special 2dsphere index on `City.location`

const userSchema = new mongoose.Schema(
  {
    profileImage: String,
    username: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validator: [validator.isEmail, `Please provide a valid email`],
    },
    name: String,
    phone: {
      type: String,
      unique: true,
      minlength: 8,
      validator: [
        validator.isMobilePhone,
        'Please provide a valid mobile number',
      ],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      minlength: 8,
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: `Passwords are not the same`,
      },
    },
    favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: [true, 'id must belong to a cafe'],
      },
    ],
    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
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

userSchema.pre('save', async function (next) {
  // Only run this function if password is actually modified
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// favorite List
userSchema.methods.FavoriteList = async function (cafeId) {
  if (this.favorites.includes(cafeId)) {
    this.favorites.pull(cafeId);
  } else {
    this.favorites.push(cafeId);
  }
  return this.save({ validateBeforeSave: false });
};

// friends List
userSchema.methods.FriendsList = function (userId) {
  if (this.friends.includes(userId)) {
    this.friends.pull(userId);
  } else {
    this.friends.push(userId);
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

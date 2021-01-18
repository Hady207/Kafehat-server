import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';

import catchAsync from '../utils/catchAsync';
import { UserServices, AppError } from '../services';

const UserInstance = new UserServices();

// Create the token
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const refreshToken = (id) => {
  return jwt.sign({ id: id }, process.env.RJWT_SECRET, {
    expiresIn: process.env.RJWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const refresh = refreshToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  //Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: {
      accessToken: token,
      refreshToken: refresh,
    },
    result: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const createdUser = await UserInstance.createUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  createSendToken(createdUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await UserInstance.loginUser(email, password);
  if (!user) {
    return next(new AppError('Incorrect email or password', 400));
  }

  createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bear')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in, Please log in to continue', 401)
    );
  }

  //2) Verification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await UserInstance.checkUser(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  //   // 4) Check if user changed password after the token was issued
  //   if (currentUser.changedPasswordAfter(decoded.iat)) {
  //     return next(
  //       new AppError('User recently changed password: Please log in again', 401)
  //     );
  //   }

  // Grant Access to the protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.refreshJWTToken = catchAsync(async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.body.refreshToken,
    process.env.RJWT_SECRET
  );
  const token = signToken(decoded.id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });
  res.status(200).json({
    status: 'success',
    token: {
      accessToken: token,
    },
  });
});
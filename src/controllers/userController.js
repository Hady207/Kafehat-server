import catchAsync from '../utils/catchAsync';
import { UserServices, AppError } from '../services';

const UserInstance = new UserServices();

exports.me = catchAsync(async (req, res, next) => {
  const user = await UserInstance.getUser(req.user.id);
  res.status(200).json({
    user,
  });
});

exports.friends = catchAsync(async (req, res, next) => {
  const user = await UserInstance.getUser(req.user.id, { path: 'friends' });
  res.status(200).json({
    friends: user.friends,
  });
});

exports.friendsActions = catchAsync(async (req, res, next) => {
  req.user.FriendsList(req.body.userId);
  res.status(201).json({
    status: 'success',
  });
});

exports.editProfile = catchAsync(async (req, res, next) => {
  const user = await UserInstance.updateUser(req.user.id, { ...req.body });
  res.status(200).json({
    user,
  });
});

exports.favoritesList = catchAsync(async (req, res, next) => {
  const list = await UserInstance.getFavoriteList(req.user.id);
  res.status(200).json({
    status: 'success',
    list,
  });
});

// admin Controller
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await UserInstance.getAllUsers();
  res.status(200).json({
    count: users.length,
    users,
  });
});

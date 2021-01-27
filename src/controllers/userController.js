import catchAsync from '../utils/catchAsync';
import { UserServices, AppError } from '../services';

const UserInstance = new UserServices();

exports.me = catchAsync(async (req, res, next) => {
  const user = await UserInstance.getUser(req.user.id);
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.editProfile = catchAsync(async (req, res, next) => {
  const user = await UserInstance.updateUser(req.user.id, { ...req.body });
  res.status(200).json({
    status: 'success',
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

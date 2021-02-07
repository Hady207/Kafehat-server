import UserModal from '../models/User';

export default class UserService {
  async createUser(user) {
    try {
      const newUser = await UserModal.create(user);
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await UserModal.findOne({ email: email }).select(
        '+password'
      );
      if (!user || !(await user.correctPassword(password, user.password))) {
        return null;
      }
      return user;
    } catch (error) {
      return error;
    }
  }

  async getUser(id) {
    const user = await UserModal.findOne({ _id: id }).select('-password');
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUser(userId, content) {
    const updatedUser = await UserModal.findByIdAndUpdate(userId, content, {
      new: true,
    });
    if (!updatedUser) {
      return null;
    }
    return updatedUser;
  }

  async getFavoriteList(id) {
    const user = await UserModal.findOne({ _id: id }).populate({
      path: 'favorites',
      select: '_id name primaryImage',
    });
    if (!user) {
      return null;
    }
    return user.favorites;
  }

  async checkUser(id) {
    //3) Check if user still exists
    const currentUser = await UserModal.findById(id);
    if (!currentUser) {
      return null;
    }
    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     new AppError('User recently changed password: Please log in again', 401)
    //   );
    // }
    return currentUser;
  }
}

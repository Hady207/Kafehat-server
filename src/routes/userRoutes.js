import { Router } from 'express';
import { authController, userController } from '../controllers';

const router = Router();

router.use(authController.protect);
router
  .route('/friends')
  .get(userController.friends)
  .post(userController.friendsActions);
router.route('/me').get(userController.me).patch(userController.editProfile);
router.route('/favorites').get(userController.favoritesList);
router
  .route('/admin/users')
  .get(authController.restrictTo('superAdmin'), userController.getAllUsers);

export default router;

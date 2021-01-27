import { Router } from 'express';
import { authController, userController } from '../controllers';

const router = Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/refreshToken').post(authController.refreshJWTToken);

router.use(authController.protect);
router.route('/me').get(userController.me).patch(userController.editProfile);
router.route('/favorites').get(userController.favoritesList);

export default router;

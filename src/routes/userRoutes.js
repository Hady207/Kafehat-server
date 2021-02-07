import { Router } from 'express';
import { authController, userController } from '../controllers';

const router = Router();

router.use(authController.protect);
router.route('/me').get(userController.me).patch(userController.editProfile);
router.route('/favorites').get(userController.favoritesList);

export default router;

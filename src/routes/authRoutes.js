import { Router } from 'express';
import { authController } from '../controllers';

const router = Router();

router.route('/signup').post(authController.signup);
router.route('/google').post(authController.googleSignin);
router.route('/facebook').post(authController.facebookSignin);
router.route('/login').post(authController.login);
router.route('/refreshToken').post(authController.refreshJWTToken);

export default router;

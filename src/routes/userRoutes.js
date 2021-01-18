import { Router } from 'express';
import { authController } from '../controllers';

const router = Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/refreshToken').post(authController.refreshJWTToken);

router.use(authController.protect);
router.route('/test').get((req, res) => {
  res.send('test');
});

export default router;

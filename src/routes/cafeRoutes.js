import { Router } from 'express';
import { cafeController, authController } from '../controllers';

const router = Router();

router
  .route('/')
  .get(cafeController.getCafes)
  .post(
    authController.protect,
    authController.restrictTo('superAdmin'),
    cafeController.createCafe
  );
router
  .route('/:cafe')
  .get(cafeController.getCafe)
  .patch(cafeController.updateCafe)
  .delete(cafeController.deleteCafe);

export default router;
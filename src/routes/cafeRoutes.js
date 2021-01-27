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

router
  .route('/cafes-within/:distance/center/:latlng/unit/:unit')
  .get(cafeController.getCafesWithin);

router.use(authController.protect);
router.post('/:cafe/favorite', cafeController.favorite);
router.route('/distance/me').get(cafeController.getCafeCloseToUser);

export default router;

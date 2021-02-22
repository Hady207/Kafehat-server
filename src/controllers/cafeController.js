import catchAsync from '../utils/catchAsync';
import { CafeServices, AppError } from '../services';

const CafeService = new CafeServices();

const createRespond = (res, statuscode, doc) =>
  res.status(statuscode).json({
    status: 'success',
    [Array.isArray(doc) && 'count']: doc.length,
    result: {
      data: doc,
    },
  });

exports.createCafe = catchAsync(async (req, res, next) => {
  const cafe = await CafeService.createCafe(req.body);
  createRespond(res, 201, cafe);
});

exports.getCafes = catchAsync(async (req, res, next) => {
  const cafes = await CafeService.getAllCafes();
  createRespond(res, 200, cafes);
});

exports.getCafe = catchAsync(async (req, res, next) => {
  const cafe = await CafeService.getOneCafe(req.params.cafe);
  if (!cafe) {
    return next(new AppError('No document found with given name', 404));
  }
  createRespond(res, 200, cafe);
});

exports.updateCafe = catchAsync(async (req, res, next) => {
  const updatedCafe = await CafeService.updateCafe(req.params.cafe, req.body);
  if (!updatedCafe) {
    return next(new AppError('No document found with given credentials', 404));
  }
  createRespond(res, 202, updatedCafe);
});

exports.deleteCafe = catchAsync(async (req, res, next) => {
  const deletedCafe = await CafeService.delete(req.params.cafe);
  createRespond(res, 204, deletedCafe);
});

exports.favorite = catchAsync(async (req, res, next) => {
  const cafe = await CafeService.getOneCafe(req.params.cafe);

  if (!cafe) {
    return next(new AppError('No document found with given name', 404));
  }

  await Promise.all([
    cafe.LikeList(req.user.id),
    req.user.FavoriteList(cafe.id),
  ]);

  res.status(201).json({
    status: 'success',
  });
});

// /cafes-within/:distance/center/:latlng/unit/:unit
exports.getCafesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,long',
        400
      )
    );
  }

  const cafes = await CafeService.cafesWithin(lng, lat, radius);
  createRespond(res, 200, cafes);
});

exports.getCafeCloseToUser = catchAsync(async (req, res, next) => {
  const latlng = {
    lat: req.user.location[0].coordinates[1],
    lng: req.user.location[0].coordinates[0],
  };
  const closestCafes = await CafeService.cafesCloseToUser(latlng);
  if (!closestCafes) {
    next(new AppError(closestCafes.message, 400));
  }

  createRespond(res, 200, closestCafes);
});

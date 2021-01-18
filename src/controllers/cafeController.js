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
  const updatedCafe = CafeService.updateCafe(req.params.cafe, req.body);
  if (!updatedCafe) {
    return next(new AppError('No document found with given credentials', 404));
  }
  createRespond(res, 202, updatedCafe);
});

exports.deleteCafe = catchAsync(async (req, res, next) => {
  const deletedCafe = CafeService.delete(req.params.cafe);
  createRespond(res, 204, deletedCafe);
});

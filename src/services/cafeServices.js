import { userController } from '../controllers';
import Cafe from '../models/Cafe';

export default class CafeService {
  async createCafe(cafe) {
    const createdCafe = await Cafe.create(cafe);
    return createdCafe;
  }

  async getAllCafes() {
    const cafes = await Cafe.find({});
    return cafes;
  }

  async getOneCafe(cafeName) {
    const cafe = await Cafe.findOne({ slug: cafeName });
    return cafe;
  }

  async updateCafe(param, body) {
    const updatedCafe = await Cafe.findOneAndUpdate({ slug: param }, body, {
      new: true,
    });
    return updatedCafe;
  }

  async deleteCafe(param) {
    const deletedCafe = await Cafe.findOneAndDelete({ slug: param });
    return deletedCafe;
  }

  async cafesWithin(radius, lng, lat) {
    const cafes = await Cafe.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    }).select('profileImage ratingAverage primaryImage name location');
    return cafes;
  }

  async cafesCloseToUser(userLocation) {
    const { lng, lat } = userLocation;
    const geoQuery = { type: 'Point', coordinates: [lng, lat] };

    const distances = await Cafe.aggregate([
      {
        $geoNear: {
          near: geoQuery,
          distanceField: 'distance',
          includeLocs: 'location.coordinates',
          // maxDistance: 2400,//25km
          spherical: true,

          distanceMultiplier: 0.001,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
          slug: 1,
          primaryImage: 1,
        },
      },
    ]);
    return distances;
  }
}

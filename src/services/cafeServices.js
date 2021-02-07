import Cafe from '../models/Cafe';

export default class CafeService {
  async createCafe(cafe) {
    try {
      const createdCafe = await Cafe.create(cafe);
      return createdCafe;
    } catch (error) {
      return error;
    }
  }

  async getAllCafes() {
    try {
      const cafes = await Cafe.find({});
      return cafes;
    } catch (error) {
      return error;
    }
  }

  async getOneCafe(cafeName) {
    try {
      const cafe = await Cafe.findOne({ slug: cafeName });
      return cafe;
    } catch (error) {
      return error;
    }
  }

  async updateCafe(param, body) {
    try {
      const updatedCafe = await Cafe.findOneAndUpdate({ slug: param }, body, {
        new: true,
      });
      return updatedCafe;
    } catch (error) {
      return error;
    }
  }

  async deleteCafe(param) {
    try {
      const deletedCafe = await Cafe.findOneAndDelete({ slug: param });
      return deletedCafe;
    } catch (error) {
      return error;
    }
  }

  async cafesWithin(radius, lng, lat) {
    try {
      const cafes = await Cafe.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
      }).select('profileImage ratingAverage primaryImage name location');
      return cafes;
    } catch (error) {
      return error;
    }
  }
}

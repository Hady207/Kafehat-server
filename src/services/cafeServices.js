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
      console.log(error);
    }
  }

  async getOneCafe(cafeName) {
    try {
      const cafe = await Cafe.findOne({ slug: cafeName });
      return cafe;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCafe(param, body) {
    try {
      const updatedCafe = await Cafe.findByIdAndUpdate({ slug: param }, body, {
        new: true,
      });
      return updatedCafe;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCafe(param) {
    try {
      const deletedCafe = await Cafe.findByIdAndRemove({ slug: param });
      return deletedCafe;
    } catch (error) {
      console.log(error);
    }
  }
}

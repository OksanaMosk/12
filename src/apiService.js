import axios from 'axios';

const BASE_URL = 'https://drinkify.b.goit.study/api/v1/cocktails/';
export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this._id;
    this.drink;
    this.drinkThumb;
    this.description;
  }
  async fetchImage() {
    try {
      const options = {
        params: {
          r: 9,
        },
      };
      const url = `${BASE_URL}`;
      const response = await axios.get(url, options);
      const data = await response.data;

      this.page += 1;
      this.totalHits = response.data.totalHits;

      return data;
    } catch (error) {
      console.log('error', error);
    }
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

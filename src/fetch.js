import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31176122-470dd6c20579d2a67d5e2ecc1';

export function fetchImages(searchQuery, page) {
  return axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    },
  });
}
import axios from 'axios';

let base_url = import.meta.env.VITE_BASE_URL || ''

export default {
  async login(credentials) {
    return axios.post(`${base_url}/api/login`, credentials);
  },
  async signup(credentials) {
    return axios.post(`${base_url}/api/register`, credentials);
  },
  async socialLogin(credentials) {
    return axios.post(`${base_url}/api/social`, credentials);
  },
};
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://206.189.205.100/', // http://localhost:3333,
});

export default api;

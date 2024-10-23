import axios from 'axios';

const instance = axios.create({
  // 클라우드 접속
  baseURL: 'https://port-0-backend-m1oid3hq64a5b55a.sel4.cloudtype.app'
  // 로컬 접속
  // baseURL: 'http://localhost:3000'
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;

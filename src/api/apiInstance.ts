import axios, {
  type AxiosInstance
} from 'axios';

console.log(process.env.SERVER_URL);

const $api: AxiosInstance = axios.create({
  baseURL: process.env.SERVER_URL + 'api' ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default $api;

import axios from 'axios';

export const $api = axios.create({
  baseURL: process.env.SERVER_URL + 'api' ??
    'https://sleepy-jay-bracelet.cyclic.app/api',
});

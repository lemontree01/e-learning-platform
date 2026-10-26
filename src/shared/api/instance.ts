import axios from 'axios';

// Next.js forwards API and course-image requests to SERVER_URL on the server.
export const serverUrl = '';

export const $api = axios.create({
  baseURL: `${serverUrl}/api`,
  timeout: 10000,
});

export const getCourseImage = (id: number) => `${serverUrl}/course-${id}.jpg`;

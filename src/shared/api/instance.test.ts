import { $api, getCourseImage } from './instance';

test('browser API requests use the frontend origin instead of a visitor localhost', () => {
  expect($api.defaults.baseURL).toBe('/api');
});

test('course thumbnails use the same origin as the page', () => {
  expect(getCourseImage(12)).toBe('/course-12.jpg');
});

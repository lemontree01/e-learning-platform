import fs from 'node:fs';
import path from 'node:path';
import { COURSE_ART_COUNT } from './CourseArtwork';
import { COURSE_ICONS } from './courseIcons';

test('every course has its own icon and rendered posters', () => {
  expect(COURSE_ICONS).toHaveLength(COURSE_ART_COUNT);
  expect(new Set(COURSE_ICONS).size).toBe(COURSE_ART_COUNT);
  const images = path.join(__dirname, '../../../../public/images/courses');
  for (let id = 0; id < COURSE_ART_COUNT; id++) {
    for (const suffix of ['-480.avif', '-960.avif', '.webp']) {
      expect(fs.existsSync(path.join(images, `course-${id}${suffix}`))).toBe(true);
    }
  }
});

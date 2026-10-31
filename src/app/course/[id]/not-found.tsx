'use client';

import { CourseFeedback } from '~/entities/Course/ui/CourseFeedback';

// Rendered with a 404 status when the API reports no such course.
export default function CourseNotFound () {
  return <CourseFeedback status='not-found' />;
}

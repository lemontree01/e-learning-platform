'use client';

import Lesson, { type LessonSeed } from '~/widgets/Lesson/Lesson';

const LessonPage = ({ seed, }: { seed?: LessonSeed }) => {
  return (
    <>
      <Lesson seed={seed} />
    </>
  );
};

export default LessonPage;

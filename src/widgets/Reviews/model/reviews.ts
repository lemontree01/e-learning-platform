import Avatar2 from '~/shared/assets/avatars/images/pic-2.jpg';
import Avatar3 from '~/shared/assets/avatars/images/pic-3.jpg';
import Avatar4 from '~/shared/assets/avatars/images/pic-4.jpg';
import Avatar5 from '~/shared/assets/avatars/images/pic-5.jpg';
import Avatar6 from '~/shared/assets/avatars/images/pic-6.jpg';
import Avatar7 from '~/shared/assets/avatars/images/pic-7.jpg';

export interface Review {
  text: string;
  author: string;
  stars: 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
  avatar: string;
}

export const reviews: Review[] = [
  {
    text: `I had an amazing experience studying in "e-learning platform." The
  instructors were knowledgeable and engaging, the course material was
  comprehensive, and the interactive learning environment made it easy
  to grasp complex programming concepts. Highly recommended for
  aspiring programmers!`,
    author: 'Benjamin Reynolds',
    stars: 4,
    avatar: Avatar3,
  },
  {
    text: `I found "e-learning platform" to be a game-changer for my
  programming journey. The platform's user-friendly interface, quality
  course content, and prompt support helped me overcome challenges and
  excel in web development. Grateful for this invaluable learning
  resource!`,
    author: 'Emily Thompson',
    stars: 4.5,
    avatar: Avatar2,
  },
  {
    text: ` My experience with "e-learning platform" was decent. The course
  material was adequate, and I appreciated the convenience of online
  learning. However, I felt that the interaction with instructors
  could have been more personalized. Overall, it served its purpose in
  introducing me to programming and web development.`,
    avatar: Avatar4,
    stars: 4,
    author: 'Jacob Mitchell',
  },
  {
    text: ` I had a mixed experience with "e-learning platform" while studying
  programming and web development. The course content was informative,
  but I encountered occasional technical glitches. The community
  support was helpful, though I wished for more instructor
  interaction. It's a decent platform for self-paced learning.`,
    stars: 5,
    author: 'Charlotte Roberts',
    avatar: Avatar5,
  },
  {
    text: `"e-learning platform" exceeded my expectations as a programming and
  web development student. The comprehensive courses, engaging
  instructors, and interactive learning resources provided a solid
  foundation. The platform's seamless user experience and supportive
  community fostered an environment of growth and achievement. Highly
  recommended for aspiring coders!`,
    stars: 4,
    author: 'Michael Anderson',
    avatar: Avatar6,
  },
  {
    text: `Studying on "e-learning platform" was a remarkable experience. The
  platform's exceptional programming and web development courses
  equipped me with invaluable skills. The instructors' expertise and
  the platform's interactive approach made learning enjoyable and
  effective. It's a top-notch choice for anyone serious about
  mastering programming.`,
    stars: 4,
    avatar: Avatar7,
    author: 'Olivia Parker',
  }
];

import { useTranslation } from 'react-i18next';
import './reviews.scss';
import Avatar2 from '~/shared/assets/avatars/images/pic-2.jpg';
import Avatar3 from '~/shared/assets/avatars/images/pic-3.jpg';
import Avatar4 from '~/shared/assets/avatars/images/pic-4.jpg';
import Avatar5 from '~/shared/assets/avatars/images/pic-5.jpg';
import Avatar6 from '~/shared/assets/avatars/images/pic-6.jpg';
import Avatar7 from '~/shared/assets/avatars/images/pic-7.jpg';

const Reviews = () => {
  const { t, } = useTranslation('about');
  return (
    <section className="reviews">
      <h1 className="heading">{t('reviews')}</h1>
      <div className="box-container">
        <div className="box">
          <p>
            I had an amazing experience studying in "e-learning platform." The
            instructors were knowledgeable and engaging, the course material was
            comprehensive, and the interactive learning environment made it easy
            to grasp complex programming concepts. Highly recommended for
            aspiring programmers!
          </p>
          <div className="student">
            <img src={Avatar3} alt="" />
            <div>
              <h3>Benjamin Reynolds</h3>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="box">
          <p>
            I found "e-learning platform" to be a game-changer for my
            programming journey. The platform's user-friendly interface, quality
            course content, and prompt support helped me overcome challenges and
            excel in web development. Grateful for this invaluable learning
            resource!
          </p>
          <div className="student">
            <img src={Avatar2} alt="" />
            <div>
              <h3>Emily Thompson</h3>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="box">
          <p>
            My experience with "e-learning platform" was decent. The course
            material was adequate, and I appreciated the convenience of online
            learning. However, I felt that the interaction with instructors
            could have been more personalized. Overall, it served its purpose in
            introducing me to programming and web development.
          </p>
          <div className="student">
            <img src={Avatar4} alt="" />
            <div>
              <h3>Jacob Mitchell</h3>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="box">
          <p>
            I had a mixed experience with "e-learning platform" while studying
            programming and web development. The course content was informative,
            but I encountered occasional technical glitches. The community
            support was helpful, though I wished for more instructor
            interaction. It's a decent platform for self-paced learning.
          </p>
          <div className="student">
            <img src={Avatar5} alt="" />
            <div>
              <h3>Charlotte Roberts</h3>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="box">
          <p>
            "e-learning platform" exceeded my expectations as a programming and
            web development student. The comprehensive courses, engaging
            instructors, and interactive learning resources provided a solid
            foundation. The platform's seamless user experience and supportive
            community fostered an environment of growth and achievement. Highly
            recommended for aspiring coders!
          </p>
          <div className="student">
            <img src={Avatar6} alt="" />
            <div>
              <h3>Michael Anderson</h3>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="box">
          <p>
            Studying on "e-learning platform" was a remarkable experience. The
            platform's exceptional programming and web development courses
            equipped me with invaluable skills. The instructors' expertise and
            the platform's interactive approach made learning enjoyable and
            effective. It's a top-notch choice for anyone serious about
            mastering programming.
          </p>
          <div className="student">
            <img src={Avatar7} alt="" />
            <div>
              <h3>Olivia Parker</h3>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

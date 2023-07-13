import { useEffect } from 'react';
import './lesson.scss';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentCourse } from '~/entities/Course';
import { avatars } from '~/shared/assets/avatars';

const Lesson = () => {
  const currentCourse = useSelector(getCurrentCourse);
  const lessonNumber = useParams().id;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth', });
  }, []);

  return (
    <section className="watch-video">
      <div className="video-container">
        <h3 className="title">
          {currentCourse?.name}. Lesson {lessonNumber}
        </h3>
        <div className="info">
          <p className="date">
            <i className="fas fa-calendar"></i>
            <span>{currentCourse?.date}</span>
          </p>
          <p className="date">
            <i className="fas fa-heart"></i>
            <span>{(currentCourse?.id % 10) + 30} likes</span>
          </p>
        </div>
        <div className="tutor">
          <img src={avatars[currentCourse?.id % 9]} alt="" />
          <div>
            <h3>{currentCourse?.author}</h3>
            <span>developer</span>
          </div>
        </div>
        <div className="flex">
          <Link to={'/course/' + currentCourse?.id} className="inline-btn">
            view course
          </Link>
          <button>
            <i className="far fa-heart"></i>
            <span>like</span>
          </button>
        </div>
        <p className="description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora quia
          optio modi suscipit mollitia sapiente a laborum cumque adipisci velit
          quo consectetur qui, quidem, eum impedit eveniet aut enim ipsa ut!
          Dolorum fugit sit, iure recusandae officia iusto ratione repellendus
          id ullam et rerum maxime soluta repudiandae molestias, eveniet est!
          Consequuntur perspiciatis fugit dolor at debitis totam rerum eligendi
          deleniti dolorem modi. Ea vel dicta possimus, accusantium quam numquam
          recusandae nesciunt corrupti rerum voluptates alias eum maxime
          dignissimos ut. Tenetur nesciunt natus ipsum ab distinctio explicabo
          laudantium quibusdam aliquam molestiae culpa minima, ratione eaque
          cumque quos earum recusandae totam, magni labore nemo perspiciatis cum
          magnam rerum quaerat hic! Accusamus corporis tenetur quisquam cumque
          mollitia consequatur nulla odio facere, nostrum eaque amet explicabo
          excepturi reiciendis cupiditate, aperiam facilis praesentium quidem
          ea, repudiandae debitis dolore? Sint, itaque quidem? Corrupti quisquam
          quibusdam, aperiam porro excepturi maxime repellendus maiores id
          facilis cupiditate, quod soluta debitis numquam laboriosam ratione sed
          adipisci impedit? Aut suscipit tempore ea est, numquam vel optio
          laborum odit sit culpa quae accusamus! Corrupti soluta nam iusto fugit
          totam, vitae obcaecati optio sint maxime fugiat, numquam repellat
          officiis cum, quos quo quisquam impedit reprehenderit saepe aut
          consequatur harum omnis iste vero. Et quidem exercitationem magnam
          nulla sint, mollitia minus distinctio culpa molestiae facere unde
          nostrum, eligendi eaque blanditiis optio enim debitis, corporis quis?
          Ducimus expedita molestias suscipit sequi. Ratione exercitationem cum
          odit, eaque aliquam labore dicta quasi blanditiis repellendus ipsam
          expedita vitae magnam, voluptates optio recusandae enim inventore
          earum ex quae perspiciatis!
        </p>
        <p className="description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora quia
          optio modi suscipit mollitia sapiente a laborum cumque adipisci velit
          quo consectetur qui, quidem, eum impedit eveniet aut enim ipsa ut!
          Dolorum fugit sit, iure recusandae officia iusto ratione repellendus
          id ullam et rerum maxime soluta repudiandae molestias, eveniet est!
          Consequuntur perspiciatis fugit dolor at debitis totam rerum eligendi
          deleniti dolorem modi. Ea vel dicta possimus, accusantium quam numquam
          recusandae nesciunt corrupti rerum voluptates alias eum maxime
          dignissimos ut. Tenetur nesciunt natus ipsum ab distinctio explicabo
          laudantium quibusdam aliquam molestiae culpa minima, ratione eaque
          cumque quos earum recusandae totam, magni labore nemo perspiciatis cum
          magnam rerum quaerat hic! Accusamus corporis tenetur quisquam cumque
          mollitia consequatur nulla odio facere, nostrum eaque amet explicabo
          excepturi reiciendis cupiditate, aperiam facilis praesentium quidem
          ea, repudiandae debitis dolore? Sint, itaque quidem? Corrupti quisquam
          quibusdam, aperiam porro excepturi maxime repellendus maiores id
          facilis cupiditate, quod soluta debitis numquam laboriosam ratione sed
          adipisci impedit? Aut suscipit tempore ea est, numquam vel optio
          laborum odit sit culpa quae accusamus! Corrupti soluta nam iusto fugit
          totam, vitae obcaecati optio sint maxime fugiat, numquam repellat
          officiis cum, quos quo quisquam impedit reprehenderit saepe aut
          consequatur harum omnis iste vero. Et quidem exercitationem magnam
          nulla sint, mollitia minus distinctio culpa molestiae facere unde
          nostrum, eligendi eaque blanditiis optio enim debitis, corporis quis?
          Ducimus expedita molestias suscipit sequi. Ratione exercitationem cum
          odit, eaque aliquam labore dicta quasi blanditiis repellendus ipsam
          expedita vitae magnam, voluptates optio recusandae enim inventore
          earum ex quae perspiciatis!
        </p>
      </div>
    </section>
  );
};

export default Lesson;

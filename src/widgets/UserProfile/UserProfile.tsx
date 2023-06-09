
import { useTranslation } from 'react-i18next';
import './userProfile.scss';
import Pic1 from '~/shared/assets/avatars/images/pic-1.jpg';

const UserProfile = () => {
  const { username, role, } = {
    username: 'Guest',
    role: 'guest',
  };

  const { t, } = useTranslation();

  return (
    <section className="user-profile">
    <h1 className="heading">your profile</h1>

    <div className="info">
      <div className="user">
        <img src={Pic1} alt="" />
        <h3>{username}</h3>
        <p>{role}</p>
        <a href="" className="inline-btn">
          {t('update profile')}
        </a>
      </div>

      <div className="box-container">
        <div className="box">
          <div className="flex">
            <i className="fas fa-bookmark"></i>
            <div>
              <span>4</span>
              <p>saved playlist</p>
            </div>
          </div>
          <a href="#" className="inline-btn">
            view playlists
          </a>
        </div>

        <div className="box">
          <div className="flex">
            <i className="fas fa-heart"></i>
            <div>
              <span>33</span>
              <p>videos liked</p>
            </div>
          </div>
          <a href="#" className="inline-btn">
            view liked
          </a>
        </div>

        <div className="box">
          <div className="flex">
            <i className="fas fa-comment"></i>
            <div>
              <span>12</span>
              <p>videos comments</p>
            </div>
          </div>
          <a href="#" className="inline-btn">
            view comments
          </a>
        </div>
      </div>
    </div>
  </section>
  );
};

export default UserProfile;

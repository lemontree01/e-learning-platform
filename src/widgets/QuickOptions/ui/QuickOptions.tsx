import { Button as InlineButton } from '~/shared/ui/Button/Button';
import Category from '../../../utils/Category';
import CodeOffRoundedIcon from '@mui/icons-material/CodeOffRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import PaletteIcon from '@mui/icons-material/Palette';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import './quickOptions.scss';
import { Link } from 'react-router-dom';
import { Text } from '~/shared/ui/Text';
import { Divider } from '~/shared/ui/Divider';
import { Card } from '~/shared/ui/Card';
import { useTranslation } from 'react-i18next';

const QuickOptions = () => {
  const { t, } = useTranslation();
  const likes = [];
  const comments = [];
  const playlists = [];

  return (
        <section className="home-grid">
          <Text size="xl" bold>{t('quick-options')}</Text>
          <Divider/>
          <div className="box-container">
            <Card>
              <Text size="m" variant="accent">{t('likes-and-comments')}</Text>
              <p className="likes">
                {t('total-likes')} : <span>{likes.length}</span>
              </p>
              <InlineButton>{t('view likes')}</InlineButton>
              <p className="likes">
                {t('total-comments')} : <span>{comments.length}</span>
              </p>
              <InlineButton>{t('view-comments')}</InlineButton>
              <p className="likes">
                {t('saved-playlists')} : <span>{playlists.length}</span>
              </p>
              <InlineButton>{t('view-playlists')}</InlineButton>
            </Card>

            <div className="box">
              <h3 className="title">{t('top-categories')}</h3>
              <div className="categories">
                <Category name={t('development')}
                icon={<CodeOffRoundedIcon />} />
                <Category name={t('business')}
                icon={<AutoGraphRoundedIcon />} />
                <Category name={t('design')} icon={<PaletteIcon />} />
                <Category name={t('marketing')} icon={<StorefrontIcon />} />
                <Category name={t('music')} icon={<MusicNoteIcon />} />
                <Category name={t('photography')}
                icon={<CameraEnhanceIcon />} />
              </div>
            </div>

            <div className="box">
              <h3 className="title">{t('popular topics')}</h3>
              <div className="categories">
                <Category name="HTML" icon={<i className="fab fa-html5"></i>} />
                <Category name="CSS" icon={<i className="fab fa-css3"></i>} />
                <Category
                  name="javascript"
                  icon={<i className="fab fa-js"></i>}
                />
                <Category
                  name="react"
                  icon={<i className="fab fa-react"></i>}
                />
                <Category name="PHP" icon={<i className="fab fa-php"></i>} />
                <Category
                  name="python"
                  icon={<i className="fa-brands fa-python"></i>}
                />
              </div>
            </div>

            <div className="box">
              <h3 className="title">{t('become a tutor')}</h3>
              <p className="tutor">
                {t('tutor')}
              </p>
              <Link to="" className="inline-btn">
                {t('get started')}
              </Link>
            </div>
          </div>
        </section>
  );
};

export default QuickOptions;

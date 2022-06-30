import PropTypes from 'prop-types';

import { useSelector } from 'hooks/hooks';

import { getFromNowTime } from 'helpers/helpers';
import { IconName } from 'common/enums/enums';
import { postType } from 'common/prop-types/prop-types';
import { IconButton, Image } from 'components/common/common';

import { HoveredPost } from './components/hovered-post.jsx';

import styles from './styles.module.scss';

const Post = ({ post, onPostLike, onExpandedPostToggle, onSharePost,
  onPostDislike, onRemovePost, onUpdatePost, onDisplayLikers, onNotDisplayLikers }) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;
  const date = getFromNowTime(createdAt);

  const likers = useSelector(state => state.posts.hoveredPost);

  const handlePostLike = () => onPostLike(id);
  const handleExpandedPostToggle = () => onExpandedPostToggle(id);
  const handleSharePost = () => onSharePost(id);
  const handlePostDislike = () => onPostDislike(id);
  const handleRemovePost = () => onRemovePost(id);
  const handleUpdatePost = () => onUpdatePost(id);
  const handleDisplayLikers = () => onDisplayLikers(id);
  const handleNotDisplayLikers = () => onNotDisplayLikers();

  return (
    <div className={styles.card}>
      {image && <Image src={image.link} alt="post image" />}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{`posted by ${user.username} - ${date}`}</span>
        </div>
        <p className={styles.description}>{body}</p>
      </div>
      <div className={styles.extra}>
        {likers && likers.post && likers.post.id === id && <HoveredPost likers={likers.users} />}
        <IconButton
          iconName={IconName.THUMBS_UP}
          label={likeCount}
          onClick={handlePostLike}
          onHover={handleDisplayLikers}
          onNotHover={handleNotDisplayLikers}
        />
        <IconButton
          iconName={IconName.THUMBS_DOWN}
          label={dislikeCount}
          onClick={handlePostDislike}
        />
        <IconButton
          iconName={IconName.COMMENT}
          label={commentCount}
          onClick={handleExpandedPostToggle}
        />
        <IconButton
          iconName={IconName.SHARE_ALTERNATE}
          onClick={handleSharePost}
        />
        <IconButton
          iconName={IconName.REMOVE}
          onClick={handleRemovePost}
        />
        <IconButton
          iconName={IconName.UPDATE}
          onClick={handleUpdatePost}
        />
      </div>
    </div>
  );
};

Post.propTypes = {
  post: postType.isRequired,
  onPostLike: PropTypes.func.isRequired,
  onExpandedPostToggle: PropTypes.func.isRequired,
  onSharePost: PropTypes.func.isRequired,
  onPostDislike: PropTypes.func.isRequired,
  onRemovePost: PropTypes.func.isRequired,
  onUpdatePost: PropTypes.func.isRequired,
  onDisplayLikers: PropTypes.func.isRequired,
  onNotDisplayLikers: PropTypes.func.isRequired
};

export { Post };

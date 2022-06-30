import PropTypes from 'prop-types';

import { getFromNowTime } from 'helpers/helpers';
import { IconName } from 'common/enums/enums';
import { postType } from 'common/prop-types/prop-types';
import { IconButton, Image } from 'components/common/common';

import styles from './styles.module.scss';

const Post = ({ post, onPostLike, onExpandedPostToggle, onSharePost, onPostDislike, onRemovePost, onUpdatePost }) => {
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

  const handlePostLike = () => onPostLike(id);
  const handleExpandedPostToggle = () => onExpandedPostToggle(id);
  const handleSharePost = () => onSharePost(id);
  const handlePostDislike = () => onPostDislike(id);
  const handleRemovePost = () => onRemovePost(id);
  const handleUpdatePost = () => onUpdatePost(id);

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
        <IconButton
          iconName={IconName.THUMBS_UP}
          label={likeCount}
          onClick={handlePostLike}
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
  onUpdatePost: PropTypes.func.isRequired
};

export { Post };

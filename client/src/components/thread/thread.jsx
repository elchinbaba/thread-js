import {
  useState,
  useCallback,
  useEffect,
  useAppForm,
  useDispatch,
  useSelector
} from 'hooks/hooks.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { threadActionCreator } from 'store/actions.js';
import { image as imageService } from 'services/services.js';
import { ThreadToolbarKey, UseFormMode } from 'common/enums/enums.js';
import { Post, Spinner, Checkbox } from 'components/common/common.js';
import { ExpandedPost, UpdatePost, SharedPostLink, AddPost } from './components/components.js';
import { DEFAULT_THREAD_TOOLBAR } from './common/constants.js';

import styles from './styles.module.scss';

const postsFilter = {
  userId: undefined,
  from: 0,
  count: 10,
  state: ''
};

const Thread = () => {
  const dispatch = useDispatch();
  const { posts, hasMorePosts, expandedPost, updatePost, userId } = useSelector(state => ({
    posts: state.posts.posts,
    hasMorePosts: state.posts.hasMorePosts,
    expandedPost: state.posts.expandedPost,
    updatePost: state.posts.updatePost,
    userId: state.profile.user.id
  }));
  // console.log(state.hoveredPost);
  const [sharedPostId, setSharedPostId] = useState(undefined);

  const { control, watch } = useAppForm({
    defaultValues: DEFAULT_THREAD_TOOLBAR,
    mode: UseFormMode.ON_CHANGE
  });

  const showOwnPosts = watch(ThreadToolbarKey.SHOW_OWN_POSTS);
  const showLikedPosts = watch(ThreadToolbarKey.SHOW_LIKED_POSTS);

  const handlePostsLoad = useCallback(filtersPayload => {
    dispatch(threadActionCreator.loadPosts(filtersPayload));
  }, [dispatch]);

  const handleToggleShowOwnPosts = useCallback(
    () => {
      postsFilter.userId = showOwnPosts || showLikedPosts ? userId : undefined;
      if (showOwnPosts && !showLikedPosts) postsFilter.state = 'own';
      else if (showOwnPosts && showLikedPosts) postsFilter.state = 'own&liked';
      else if (!showOwnPosts && showLikedPosts) postsFilter.state = 'liked';
      else postsFilter.state = 'none';
      // console.log(postsFilter.userId);
      postsFilter.from = 0;
      handlePostsLoad(postsFilter);
      postsFilter.from = postsFilter.count; // for the next scroll
    },
    [userId, showOwnPosts, handlePostsLoad]
  );

  useEffect(() => {
    handleToggleShowOwnPosts();
  }, [showOwnPosts, handleToggleShowOwnPosts]);

  const handlePostsLoadLiked = useCallback(id => {
    dispatch(threadActionCreator.loadLikedPosts(id));
  }, [dispatch]);

  const handleToggleShowLikedPosts = useCallback(
    () => {
      postsFilter.userId = showLikedPosts || showOwnPosts ? userId : undefined;
      if (showLikedPosts && !showOwnPosts) postsFilter.state = 'liked';
      else if (showLikedPosts && showOwnPosts) postsFilter.state = 'own&liked';
      else if (!showLikedPosts && showOwnPosts) postsFilter.state = 'own';
      else postsFilter.state = 'none';
      // console.log(postsFilter.userId);
      postsFilter.from = 0;
      handlePostsLoadLiked(postsFilter);
      postsFilter.from = postsFilter.count; // for the next scroll
    },
    [userId, showLikedPosts, handlePostsLoadLiked]
  );

  useEffect(() => {
    handleToggleShowLikedPosts();
  }, [showLikedPosts, handleToggleShowLikedPosts]);

  const handlePostLike = useCallback(
    id => dispatch(threadActionCreator.likePost(id)),
    [dispatch]
  );

  const handleDisplayLikers = useCallback(
    id => dispatch(threadActionCreator.displayLikers(id)),
    [dispatch]
  );

  const handleNotDisplayLikers = useCallback(
    () => dispatch(threadActionCreator.notDisplayLikers()),
    [dispatch]
  );

  const handlePostDislike = useCallback(
    id => dispatch(threadActionCreator.dislikePost(id)),
    [dispatch]
  );

  const handleExpandedPostToggle = useCallback(
    id => dispatch(threadActionCreator.toggleExpandedPost(id)),
    [dispatch]
  );

  const handleUpdatePost = useCallback(
    id => dispatch(threadActionCreator.toggleUpdatePost(id)),
    [dispatch]
  );

  const handlePostAdd = useCallback(
    postPayload => dispatch(threadActionCreator.createPost(postPayload)),
    [dispatch]
  );

  const handlePostEdit = useCallback(
    postPayload => dispatch(threadActionCreator.updatePost(postPayload)),
    [dispatch]
  );

  const handleMorePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadMorePosts(filtersPayload));
    },
    [dispatch]
  );

  const handleGetMorePosts = useCallback(() => {
    handleMorePostsLoad(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  }, [handleMorePostsLoad]);

  const handleSharePost = id => setSharedPostId(id);

  const handleRemovePost = useCallback(
    id => dispatch(threadActionCreator.removePost(id)),
    [dispatch]
  );
  const handleUploadImage = file => imageService.uploadImage(file);

  const handleCloseSharedPostLink = () => setSharedPostId(undefined);

  useEffect(() => {
    handleGetMorePosts();
  }, [handleGetMorePosts]);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost onPostAdd={handlePostAdd} onUploadImage={handleUploadImage} />
      </div>
      <form name="thread-toolbar">
        <div className={styles.toolbar}>
          <Checkbox
            name={ThreadToolbarKey.SHOW_OWN_POSTS}
            control={control}
            label="Show only my posts"
          />
        </div>
      </form>
      <form name="thread-toolbar">
        <div className={styles.toolbar}>
          <Checkbox
            name={ThreadToolbarKey.SHOW_LIKED_POSTS}
            control={control}
            label="Show only liked posts"
          />
        </div>
      </form>
      <InfiniteScroll
        dataLength={posts.length}
        next={handleGetMorePosts}
        scrollThreshold={0.8}
        hasMore={hasMorePosts}
        loader={<Spinner key="0" />}
      >
        {posts.map(post => (
          <Post
            post={post}
            onPostLike={handlePostLike}
            onPostDislike={handlePostDislike}
            onExpandedPostToggle={handleExpandedPostToggle}
            onSharePost={handleSharePost}
            onUpdatePost={handleUpdatePost}
            onRemovePost={handleRemovePost}
            onDisplayLikers={handleDisplayLikers}
            onNotDisplayLikers={handleNotDisplayLikers}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
      {updatePost && <UpdatePost onPostEdit={handlePostEdit} />}
      {expandedPost && <ExpandedPost onSharePost={handleSharePost} />}
      {sharedPostId && (
        <SharedPostLink
          postId={sharedPostId}
          onClose={handleCloseSharedPostLink}
        />
      )}
    </div>
  );
};

export { Thread };

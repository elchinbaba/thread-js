import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionType } from './common.js';

// const loadPosts = createAsyncThunk(
//   ActionType.SET_ALL_POSTS,
//   async (filters, { extra: { services } }) => {
//     const posts = await services.post.getAllPosts(filters);
//     return { posts };
//   }
// );
const loadPosts = createAsyncThunk(
  ActionType.SET_ALL_POSTS,
  async (filters, { extra: { services } }) => {
    let posts;
    const { state, userId } = filters;

    if (state === 'own' || state === 'none') {
      posts = await services.post.getAllPosts(filters);
      return { posts };
    }
    posts = await services.post.getPosts();

    const reactions = await services.post.getPostReactions();

    const reactedPosts = [];
    reactions.forEach(reaction => {
      if (reaction.isLike === true && reaction.userId === userId) {
        reactedPosts.push(reaction.postId);
      }
    });

    posts = posts.filter(post => reactedPosts.includes(post.id));

    if (state === 'own&liked') {
      posts = posts.filter(post => post.userId === userId);
    }

    return { posts };
  }
);

const loadLikedPosts = createAsyncThunk(
  ActionType.SET_LIKED_POSTS,
  async (filters, { extra: { services } }) => {
    const { state, userId } = filters;
    let posts;

    if (state === 'own' || state === 'none') {
      posts = await services.post.getAllPosts(filters);
      return { posts };
    }
    posts = await services.post.getPosts();

    const reactions = await services.post.getPostReactions();

    const reactedPosts = [];
    reactions.forEach(reaction => {
      if (reaction.isLike === true && reaction.userId === userId) {
        reactedPosts.push(reaction.postId);
      }
    });

    posts = posts.filter(post => reactedPosts.includes(post.id));

    if (state === 'own&liked') {
      posts = posts.filter(post => post.userId === userId);
    }

    return { posts };
  }
);

const loadMorePosts = createAsyncThunk(
  ActionType.LOAD_MORE_POSTS,
  async (filters, { getState, extra: { services } }) => {
    const {
      posts: { posts }
    } = getState();
    const loadedPosts = await services.post.getAllPosts(filters);
    const filteredPosts = loadedPosts.filter(
      post => !(posts && posts.some(loadedPost => post.id === loadedPost.id))
    );

    return { posts: filteredPosts };
  }
);

const applyPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (postId, { extra: { services } }) => {
    const post = await services.post.getPost(postId);
    return { post };
  }
);

const createPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (post, { extra: { services } }) => {
    const { id } = await services.post.addPost(post);
    const newPost = await services.post.getPost(id);

    return { post: newPost };
  }
);

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

// const likePost = createAsyncThunk(
//   ActionType.REACT,
//   async (postId, { getState, extra: { services } }) => {
//     const { id } = await services.post.likePost(postId);
//     const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed

//     const mapLikes = post => ({
//       ...post,
//       likeCount: Number(post.likeCount) + diff // diff is taken from the current closure
//     });

//     const {
//       posts: { posts, expandedPost }
//     } = getState();
//     const updated = posts.map(post => (
//       post.id !== postId ? post : mapLikes(post)
//     ));
//     const updatedExpandedPost = expandedPost?.id === postId
//       ? mapLikes(expandedPost)
//       : undefined;

//     return { posts: updated, expandedPost: updatedExpandedPost };
//   }
// );

const check = [];
const likePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const { id, isLike } = await services.post.likePost(postId);

    if (check.find(element => element.id === id) === undefined) {
      check.push({
        id,
        like: false,
        dislike: false
      });
    }
    const element = check.find(elem => elem.id === id);

    let diffLike = 0;
    let diffDislike = 0;
    if (element.like === false && (isLike === true)) {
      element.like = true;
      diffLike = 1;
      if (element.dislike === true) {
        element.dislike = false;
        diffDislike = -1;
      }
    } else if (element.like === true || isLike === undefined) {
      element.like = false;
      diffLike = -1;
    }
    if (isLike === false) {
      diffLike = 1;
      diffDislike = -1;
    }

    const mapLikes = post => ({
      ...post,
      likeCount: Number(post.likeCount) + diffLike,
      dislikeCount: Number(post.dislikeCount) + diffDislike
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== postId ? post : mapLikes(post)
    ));
    const updatedExpandedPost = expandedPost?.id === postId
      ? mapLikes(expandedPost)
      : undefined;
    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

const dislikePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const { id, isLike } = await services.post.dislikePost(postId);

    if (check.find(element => element.id === id) === undefined) {
      check.push({ id, like: false, dislike: false });
    }
    const element = check.find(elem => elem.id === id);

    let diffLike = 0;
    let diffDislike = 0;
    if (element.dislike === false && (isLike === false)) {
      element.dislike = true;
      diffDislike = 1;
      if (element.like === true) {
        element.like = false;
        diffLike = -1;
      }
    } else if (element.dislike === true || isLike === undefined) {
      element.dislike = false;
      diffDislike = -1;
    }
    if (isLike === true) {
      diffDislike = 1;
      diffLike = -1;
    }

    const mapDislikes = post => ({
      ...post,
      dislikeCount: Number(post.dislikeCount) + diffDislike,
      likeCount: Number(post.likeCount) + diffLike
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== postId ? post : mapDislikes(post)
    ));

    const updatedExpandedPost = expandedPost?.id === postId
      ? mapDislikes(expandedPost)
      : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

const addComment = createAsyncThunk(
  ActionType.COMMENT,
  async (request, { getState, extra: { services } }) => {
    const { id } = await services.comment.addComment(request);
    const comment = await services.comment.getComment(id);

    const mapComments = post => ({
      ...post,
      commentCount: Number(post.commentCount) + 1,
      comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== comment.postId ? post : mapComments(post)
    ));

    const updatedExpandedPost = expandedPost?.id === comment.postId
      ? mapComments(expandedPost)
      : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

const removePost = createAsyncThunk(
  ActionType.REMOVE_POST,
  async (postId, { extra: { services } }) => {
    await services.post.removePost(postId);
    return { postId };
  }
);

const updatePost = createAsyncThunk(
  ActionType.UPDATE_POST,
  async (postPayload, { extra: { services } }) => {
    const post = await services.post.updatePost(postPayload);
    return { post };
  }
);

const toggleUpdatePost = createAsyncThunk(
  ActionType.SET_UPDATE_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);
// const displayLikersPopup = createAsyncThunk(
//   ActionType.GET_LIKERS_POPUP,
//   async (postId, { extra: { services } }) => {
//     const post = await services.post.getPost(postId);
//     return { post };
//   }
// );

const displayLikers = createAsyncThunk(
  ActionType.DISPLAY_LIKERS,
  async (postId, { extra: { services } }) => {
    const post = await services.post.getPost(postId);

    let reactions = await services.post.getPostReactions();

    reactions = reactions.filter(reaction => reaction.isLike === true && reaction.postId === postId);
    const reactionOfUsers = reactions.map(reaction => reaction.userId);

    let users = await services.user.getUsers();

    users = users.filter(user => reactionOfUsers.includes(user.id));

    users = users.map(user => user.username);

    return { post, users };
  }
);

const notDisplayLikers = createAsyncThunk(
  ActionType.NOT_DISPLAY_LIKERS,
  () => {
    return {
      post: null,
      users: []
    };
  }
);

const updateUser = createAsyncThunk(
  ActionType.UPDATE_PROFILE,
  async (payload, { extra: { services } }) => {
    const { id, username, status } = payload;
    const data = { username, status, isPassword: false };
    const user = await services.user.updateUser(id, data);

    return user;
  }
);

export {
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  toggleExpandedPost,
  likePost,
  addComment,
  dislikePost,
  removePost,
  loadLikedPosts,
  updatePost,
  toggleUpdatePost,
  // displayLikersPopup,
  displayLikers,
  notDisplayLikers,
  updateUser
};

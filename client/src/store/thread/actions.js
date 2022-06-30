import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionType } from './common.js';

const loadPosts = createAsyncThunk(
  ActionType.SET_ALL_POSTS,
  async (filters, { extra: { services } }) => {
    let posts;
    const { state, userId } = filters;
    // console.log(state);
    if (state === 'own' || state === 'none') {
      // filters.userId = filters.userId.userId;
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
    // filters.userId = filters.userId.userId;
    // const { userId } = filters;

    // console.log('filter1', filters);

    // let posts = await services.post.getAllPosts(filters);
    // if (state === 2) {
    //   const reactions = await services.post.getPostReactions();

    //   const reactedPosts = [];
    //   reactions.forEach(reaction => {
    //     if (reaction.isLike === true && reaction.userId === filters.userId) {
    //       reactedPosts.push(reaction.postId);
    //     }
    //   });

    //   posts = posts.filter(post => reactedPosts.includes(post.id));
    // } else if (state === 3) {
    //   console.log('state', state);
    //   const filter = {
    //     userId: undefined,
    //     from: 0,
    //     count: 10
    //   };

    //   let posts0 = await services.post.getPosts(filter);

    //   const reactions0 = await services.post.getPostReactions();

    //   const reactedPosts0 = [];
    //   reactions0.forEach(reaction => {
    //     if (reaction.isLike === true && reaction.userId === filters.userId) {
    //       reactedPosts0.push(reaction.postId);
    //     }
    //   });
    //   console.log(reactedPosts0);

    //   posts0 = posts0.filter(post => reactedPosts0.includes(post.id));
    //   return { posts: posts0 };
    // }

    // return { posts };
  }
);

const loadLikedPosts = createAsyncThunk(
  ActionType.GET_ALL_POSTS,
  async (filters, { extra: { services } }) => {
    const { state, userId } = filters;
    let posts;
    if (state === 'own' || state === 'none') {
      // console.log('state', state);
      // filters.userId = filters.userId.userId;
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
      // console.log('state', state);
      posts = posts.filter(post => post.userId === userId);
    }
    return { posts };
    // console.log(state);
    // filters.userId = filters.userId.userId;

    // console.log('filter2', filters);

    // let posts = await services.post.getAllPosts(filters);
    // if (state === 1 || state === 2) {
    //   const reactions = await services.post.getPostReactions();

    //   const reactedPosts = [];
    //   reactions.forEach(reaction => {
    //     if (reaction.isLike === true && reaction.userId === filters.userId) {
    //       reactedPosts.push(reaction.postId);
    //     }
    //   });

    //   posts = posts.filter(post => reactedPosts.includes(post.id));
    // }
    // return { posts };
  }
);

const loadMorePosts = createAsyncThunk(
  ActionType.LOAD_MORE_POSTS,
  async (filters, { getState, extra: { services } }) => {
    const {
      posts: { posts }
    } = getState();
    // console.log('state', filters.state);
    if (filters.state === 'own' || filters.state === 'own&liked') {
      return { posts: [] };
    }
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

const removePost = createAsyncThunk(
  ActionType.REMOVE_POST,
  async (postId, { extra: { services } }) => {
    await services.post.removePost(postId);
    return { postId };
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

const updatePost = createAsyncThunk(
  ActionType.UPDATE_POST,
  async (postPayload, { extra: { services } }) => {
    const post = await services.post.updatePost(postPayload);
    return { post };
  }
);

// const updatePost = createAsyncThunk(
//   ActionType.UPDATE_POST,
//   async (postId, { extra: { services } }) => {
//     const post = postId ? await services.post.getPost(postId) : undefined;
//     return { post };
//   }
// );

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    // console.log(post);
    return { post };
  }
);

const toggleUpdatePost = createAsyncThunk(
  ActionType.GET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

const displayLikersPopup = createAsyncThunk(
  ActionType.GET_LIKERS_POPUP,
  async (postId, { extra: { services } }) => {
    const post = await services.post.getPost(postId);
    return { post };
  }
);

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
    // console.log('checkLike checkDislike isLike', element.like, element.dislike, isLike);
    // const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed
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
    // console.log('diffLike diffDislike', diffLike, diffDislike);

    const mapLikes = post => ({
      ...post,
      likeCount: Number(post.likeCount) + diffLike, // diff is taken from the current closure
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
    // console.log('checkLike checkDislike isLike', element.like, element.dislike, isLike);
    // const diff = id ? 1 : -1; // if ID exists then the post was disliked, otherwise - dislike was removed
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
    // console.log('diffLike diffDislike', diffLike, diffDislike);

    const mapDislikes = post => ({
      ...post,
      dislikeCount: Number(post.dislikeCount) + diffDislike, // diff is taken from the current closure
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

const displayLikers = createAsyncThunk(
  ActionType.DISPLAY_LIKERS,
  async (postId, { extra: { services } }) => {
    const post = await services.post.getPost(postId);

    let reactions = await services.post.getPostReactions();

    reactions = reactions.filter(reaction => reaction.isLike === true && reaction.postId === postId);
    const reactionOfUsers = reactions.map(reaction => reaction.userId);
    // console.log(services.user);

    let users = await services.user.getUsers();
    // console.log(users);
    users = users.filter(user => reactionOfUsers.includes(user.id));
    // reactions.forEach(reaction => users.push(reaction.userId));

    // console.log(users);

    // users[0] = await services.user.getUser(users[0]);
    // console.log(users[0]);
    // const promises = [];
    // for (let i = 0; i < users.length; i += 1) {
    //   promises.push(services.user.getUserById(users[i]));
    // }
    // users = await Promise.all(promises);

    // console.log(users);

    // for (let i = 0; i < users.length; i += 1) {
    //   users[i] = services.post.getUserById(users[i]);
    // }
    // await Promise.all(users);

    users = users.map(user => user.username);
    // console.log({ post, users });
    return { post, users };
  }
);

const notDisplayLikers = createAsyncThunk(
  ActionType.NOT_DISPLAY_LIKERS,
  () => {
    // console.log('hi');
    return {
      post: null,
      users: []
    };
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

const updateUser = createAsyncThunk(
  ActionType.UPDATE_PROFILE,
  async (payload, { extra: { services } }) => {
    const { id, username, status } = payload;
    const data = { username, status, isPassword: false };
    const user = await services.user.updateUser(id, data);

    return user;
  }
);

const updateUserStatus = createAsyncThunk(
  ActionType.UPDATE_USER_STATUS,
  async (payload, { extra: { services } }) => {
    const { id, status } = payload;
    const data = { status, isPassword: false };
    const user = await services.user.updateUser(id, data);

    return user;
  }
);

const updateUserPassword = createAsyncThunk(
  ActionType.RESET_USER_PASSWORD,
  async (payload, { extra: { services } }) => {
    const { id, password } = payload;
    const data = { password, isPassword: true };
    const user = await services.user.updateUser(id, data);

    return user;
  }
);

export {
  loadPosts,
  loadLikedPosts,
  loadMorePosts,
  applyPost,
  removePost,
  updatePost,
  createPost,
  toggleExpandedPost,
  toggleUpdatePost,
  displayLikersPopup,
  likePost,
  dislikePost,
  displayLikers,
  notDisplayLikers,
  addComment,
  updateUser,
  updateUserStatus,
  updateUserPassword
};

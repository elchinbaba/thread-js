import { createReducer, isAnyOf } from '@reduxjs/toolkit';

// import { profileActionCreator } from 'store/actions.js';
import {
  loadPosts,
  loadLikedPosts,
  loadMorePosts,
  toggleExpandedPost,
  toggleUpdatePost,
  likePost,
  dislikePost,
  displayLikers,
  notDisplayLikers,
  addComment,
  applyPost,
  createPost,
  removePost,
  updatePost
} from './actions.js';

const initialState = {
  posts: [],
  expandedPost: null,
  updatePost: null,
  hoveredPost: {
    post: null,
    users: []
  },
  hasMorePosts: true
};

const reducer = createReducer(initialState, builder => {
  builder.addCase(loadPosts.fulfilled, (state, action) => {
    const { posts } = action.payload;

    state.posts = posts;
    state.hasMorePosts = Boolean(posts.length);
  });
  builder.addCase(loadLikedPosts.fulfilled, (state, action) => {
    const { posts } = action.payload;

    state.posts = posts;
    state.hasMorePosts = Boolean(posts.length);
  });
  builder.addCase(removePost.fulfilled, (state, action) => {
    const { postId } = action.payload;

    state.posts = state.posts.filter(post => post.id !== postId);
    state.hasMorePosts = Boolean(state.posts.length);
  });
  builder.addCase(updatePost.fulfilled, (state, action) => {
    const { id: postId } = action.payload.post;

    state.posts.find(post => post.id === postId).body = action.payload.post.body;
    // state.posts = state.posts.map(post => { return post.id === postId ? action.payload.post : post; });
    state.hasMorePosts = Boolean(state.posts.length);
  });
  builder.addCase(loadMorePosts.pending, state => {
    state.hasMorePosts = null;
  });
  builder.addCase(loadMorePosts.fulfilled, (state, action) => {
    const { posts } = action.payload;

    state.posts = state.posts.concat(posts);
    state.hasMorePosts = Boolean(posts.length);
  });
  builder.addCase(toggleExpandedPost.fulfilled, (state, action) => {
    const { post } = action.payload;

    state.expandedPost = post;
  });
  builder.addCase(toggleUpdatePost.fulfilled, (state, action) => {
    const { post } = action.payload;

    state.updatePost = post;
  });
  // builder.addCase(updateUser.fulfilled, action => {
  //   if (action.payload) {
  //     profileActionCreator.updateUser(action.payload);
  //   }
  // });
  builder.addMatcher(
    isAnyOf(likePost.fulfilled, addComment.fulfilled),
    (state, action) => {
      const { posts, expandedPost } = action.payload;
      state.posts = posts;
      state.expandedPost = expandedPost;
    }
  );
  builder.addMatcher(
    isAnyOf(dislikePost.fulfilled, addComment.fulfilled),
    (state, action) => {
      const { posts, expandedPost } = action.payload;
      state.posts = posts;
      state.expandedPost = expandedPost;
    }
  );
  builder.addMatcher(
    isAnyOf(displayLikers.fulfilled, addComment.fulfilled),
    (state, action) => {
      state.hoveredPost = action.payload;
      // console.log(state.hoveredPost);
    }
  );
  builder.addMatcher(
    isAnyOf(notDisplayLikers.fulfilled, addComment.fulfilled),
    (state, action) => {
      state.hoveredPost = action.payload;
      // console.log(state.hoveredPost);
    }
  );
  builder.addMatcher(
    isAnyOf(applyPost.fulfilled, createPost.fulfilled),
    (state, action) => {
      const { post } = action.payload;

      state.posts = [post, ...state.posts];
    }
  );
});

export { reducer };

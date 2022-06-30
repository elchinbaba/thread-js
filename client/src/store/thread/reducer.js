import { createReducer, isAnyOf } from '@reduxjs/toolkit';
import {
  loadPosts,
  loadMorePosts,
  toggleExpandedPost,
  likePost,
  addComment,
  applyPost,
  createPost,
  dislikePost,
  removePost,
  loadLikedPosts,
  updatePost,
  toggleUpdatePost
} from './actions.js';

const initialState = {
  posts: [],
  expandedPost: null,
  hasMorePosts: true,
  updatePost: null
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
  builder.addCase(removePost.fulfilled, (state, action) => {
    const { postId } = action.payload;

    state.posts = state.posts.filter(post => post.id !== postId);
    state.hasMorePosts = Boolean(state.posts.length);
  });
  builder.addCase(updatePost.fulfilled, (state, action) => {
    const { id: postId } = action.payload.post;

    state.posts.find(post => post.id === postId).body = action.payload.post.body;
    state.hasMorePosts = Boolean(state.posts.length);
  });
  builder.addMatcher(
    isAnyOf(likePost.fulfilled, addComment.fulfilled),
    (state, action) => {
      const { posts, expandedPost } = action.payload;
      state.posts = posts;
      state.expandedPost = expandedPost;
    }
  );
  builder.addMatcher(
    isAnyOf(applyPost.fulfilled, createPost.fulfilled),
    (state, action) => {
      const { post } = action.payload;

      state.posts = [post, ...state.posts];
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
});

export { reducer };

import { Abstract } from '../abstract/abstract.repository.js';

class PostReaction extends Abstract {
  constructor({ postReactionModel }) {
    super(postReactionModel);
  }

  getPostReactions() {
    return this.model
      .query()
      .select()
      .withGraphFetched('[post]');
  }

  getPostReaction(userId, postId) {
    return this.model
      .query()
      .select()
      .where({ userId })
      .andWhere({ postId })
      .withGraphFetched('[post]')
      .first();
  }
}

export { PostReaction };

import { Abstract } from '../abstract/abstract.repository.js';

class User extends Abstract {
  constructor({ userModel }) {
    super(userModel);
  }

  addUser(user) {
    return this.create(user);
  }

  getByEmail(email) {
    return this.model.query().select().where({ email }).first();
  }

  getByUsername(username) {
    return this.model.query().select().where({ username }).first();
  }

  getUserById(id) {
    return this.model
      .query()
      .select('id', 'createdAt', 'email', 'updatedAt', 'username', 'status')
      .where({ id })
      .withGraphFetched('[image]')
      .first();
  }

  getUsers() {
    return this.model.query().select().withGraphFetched('[image]');
  }
}

export { User };

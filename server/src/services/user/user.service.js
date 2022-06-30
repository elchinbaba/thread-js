import { encrypt } from '../../helpers/helpers.js';

class User {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async getUserById(id) {
    const user = await this._userRepository.getUserById(id);

    return user;
  }

  async getUsers() {
    const users = await this._userRepository.getUsers();

    return users;
  }

  async updateUser(id, data) {
    const isPassword = data.isPassword;
    delete data.isPassword;

    if (isPassword) {
      data.password = await encrypt(data.password);
      return this._userRepository.updateById(id, data);
    }
    
    return this._userRepository.updateById(id, data);
  }
}

export { User };

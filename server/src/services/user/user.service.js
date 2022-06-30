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
}

export { User };

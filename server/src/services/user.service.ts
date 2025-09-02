import UserRepository from "../repositories/user.repository";

class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(email: string, password: string) {
    const newUser = await this.userRepository.createUser(email, password);

    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);

    return user;
  }
}

export default UserService;

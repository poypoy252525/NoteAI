import UserRepository from "../repositories/user.repository";

class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(email: string) {
    return this.userRepository.createUser(email);
  }
}

export default UserService;

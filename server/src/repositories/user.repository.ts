import { PrismaClient } from "@prisma/client";

class UserRepository {
  private prisma: PrismaClient = new PrismaClient();

  async createUser(email: string) {
    const user = await this.prisma.user.create({
      data: {
        email,
      },
    });

    return user;
  }
}

export default UserRepository;

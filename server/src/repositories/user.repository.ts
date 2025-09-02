import { PrismaClient } from "@prisma/client";

class UserRepository {
  private prisma: PrismaClient = new PrismaClient();

  async createUser(email: string, password: string) {
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
      },
      select: {
        email: true,
        id: true,
      },
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}

export default UserRepository;

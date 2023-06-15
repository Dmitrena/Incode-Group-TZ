import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { Role } from 'src/auth/enums';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserObject } from './return-user.object';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async hashData(data: string): Promise<string> {
    return hash(data);
  }

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.findUserByEmail(createUserDto.email);
    if (existUser) {
      throw new ConflictException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hash,
        bossId: createUserDto.bossId,
      },
    });

    return newUser;
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: ReturnUserObject,
    });
  }

  async getUsersByRole(role: Role, userId: number) {
    if (role === Role.ADMIN) {
      const users = await this.prisma.user.findMany({
        select: ReturnUserObject,
      });

      return users.map((user) => {
        if (user.role === Role.USER) {
          delete user.subordinates;
        }
        return user;
      });
    }

    if (role === Role.BOSS) {
      const boss = await this.findUserById(userId);
      boss.subordinates = await this.getSubordinates(userId);

      return [boss, ...boss.subordinates];
    }

    if (role === Role.USER) {
      const user = await this.findUserById(userId);
      delete user.subordinates;
      return user;
    }
  }

  private async getSubordinates(userId: number) {
    const users = await this.prisma.user.findMany({
      where: { bossId: userId },
      select: { ...ReturnUserObject, subordinates: false },
    });

    const subordinates = [];
    for (const user of users) {
      subordinates.push(user);
      const nestedSubordinates = await this.getSubordinates(user.id);
      subordinates.push(...nestedSubordinates);
    }

    return subordinates;
  }

  async changeUserBoss(userId: number, bossId: number, currentBossId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { boss: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.bossId !== currentBossId) {
      throw new ConflictException('You are not a boss for this subordinate');
    }

    if (user.role !== Role.USER) {
      throw new ConflictException('User is not a user');
    }

    const boss = await this.findUserById(bossId);

    if (boss.role !== Role.BOSS) {
      throw new ConflictException('This user is not a boss!');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { bossId: boss.id },
    });
  }
}

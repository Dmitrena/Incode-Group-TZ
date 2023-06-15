import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { UserService } from './../user/user.service';
import { AuthDto } from './dto/auth-dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        role: true,
        password: true,
        email: true,
        id: true,
      },
    });

    if (!user) return null;

    const pwValid = await argon2.verify(user.password, password);
    if (!pwValid) return null;

    return user;
  }

  async registerUser(authDto: AuthDto) {
    return await this.userService.createUser(authDto);
  }
}

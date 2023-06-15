import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Role } from '../enums';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credentials incorrect');
    }

    const userIsAdmin = user.role === Role.ADMIN;
    const userIsBoss = user.role === Role.BOSS;

    let userRole = Role.USER;
    if (userIsBoss) userRole = Role.BOSS;
    if (userIsAdmin) userRole = Role.ADMIN;

    return {
      userId: user.id,
      email: user.email,
      roles: [userRole],
    };
  }
}

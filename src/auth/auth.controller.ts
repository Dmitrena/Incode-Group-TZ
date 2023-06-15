import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Session,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth-dto';
import { Role } from './enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SetMetadata('isPublic', true)
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Req() req: Request, @Session() session: SessionData) {
    session.user = {
      userId: req.user.userId,
      email: req.user.email,
      roles: req.user.roles,
    };
    return {
      status: HttpStatus.OK,
    };
  }

  @SetMetadata('isPublic', true)
  @HttpCode(HttpStatus.OK)
  @Post('/registration')
  async register(@Req() req: Request, @Session() session: SessionData) {
    const authDto: AuthDto = req.body;
    const newUser = await this.authService.registerUser(authDto);
    session.user = {
      userId: newUser.id,
      email: newUser.email,
      roles: [newUser.role as Role],
    };
    return {
      status: HttpStatus.OK,
      message: 'User registered successfully',
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        resolve({
          status: 204,
          message: 'Session destroyed',
        });
      });
    });
  }
}

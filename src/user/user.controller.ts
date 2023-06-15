import { Body, Controller, Get, Patch, Session } from '@nestjs/common';
import { SessionData } from 'express-session';
import { ChangeBossDto } from './dto/change-boss.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getMe(@Session() session: SessionData) {
    const { roles, userId } = session.user;
    return this.userService.getUsersByRole(roles[0], userId);
  }

  @Patch('change-boss')
  async changeBoss(
    @Body() dto: ChangeBossDto,
    @Session() session: SessionData,
  ) {
    const { userId: currentUserId } = session.user;
    return await this.userService.changeUserBoss(
      dto.userId,
      dto.bossId,
      currentUserId,
    );
  }
}

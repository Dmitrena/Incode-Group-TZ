import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ACGuard, AccessControlModule } from 'nest-access-control';
import { AuthModule } from './auth/auth.module';
import { SessionGuard } from './auth/guards';
import { RBAC_POLICY } from './auth/rbac-policy';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccessControlModule.forRoles(RBAC_POLICY),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ACGuard,
    },
  ],
})
export class AppModule {}

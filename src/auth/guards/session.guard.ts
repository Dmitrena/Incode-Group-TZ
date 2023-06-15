import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublicRoute) return true;

    const request = context.switchToHttp().getRequest<Request>();
    if (request.session?.user?.userId) {
      request.user = request.session.user;
      return true;
    }

    throw new UnauthorizedException('Session not provided');
  }
}

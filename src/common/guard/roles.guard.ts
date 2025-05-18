import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from '../../auth/dto/jwt-payload.dto';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const user = context.switchToHttp().getRequest<Request>()
      .user as JwtPayload;

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied');
    }

    const hasRole = user.roles?.some((role: string) =>
      requiredRoles.includes(role),
    );
    if (!hasRole) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}

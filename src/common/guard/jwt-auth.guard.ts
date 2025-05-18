import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    const token = req.cookies['jwt-token'] as string | undefined;

    if (!token) return false;

    req.headers.authorization = `Bearer ${token}`;
    // console.log(req.headers.authorization);
    return super.canActivate(context);
  }
}

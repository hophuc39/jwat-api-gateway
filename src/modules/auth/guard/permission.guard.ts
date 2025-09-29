import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.permissions || !user.permissions.includes(requiredPermission)) {
      throw new ForbiddenException('User does not have sufficient permissions');
    }

    return true;
  }
}

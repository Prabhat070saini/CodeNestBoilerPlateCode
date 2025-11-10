import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PROTECTED_ROUTE } from '../constants/response.message';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1️⃣ Get required roles from metadata (method + controller)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    this.logger.debug(requiredRoles, 'Required Roles');

    // 2️⃣ If no specific roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.debug('[PermissionGuard] No required roles specified');
      return true;
    }

    // 3️⃣ Get roles injected by AuthnGuard
    const user = request.user;
    if (!user) {
      this.logger.debug('[PermissionGuard] No user found in request');
      throw new ForbiddenException(PROTECTED_ROUTE);
    }

    const userRoles = user.roles || [];

    this.logger.debug(userRoles, 'User Roles');

    // 4️⃣ Check if user has at least one required role
    const hasPermission = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasPermission) {
      this.logger.debug(
        `[PermissionGuard] User lacks required roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(PROTECTED_ROUTE);
    }

    return true;
  }
}

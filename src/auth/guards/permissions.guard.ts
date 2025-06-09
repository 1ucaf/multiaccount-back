import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "../../permissions/dictionary/permissions.dictionary";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { Role } from "../enums/role.enum";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if(!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if(user.roles.includes(Role.MASTER)) return true;
    return requiredPermissions.some((permission: string) => user.permissions?.includes(permission));
  }
}
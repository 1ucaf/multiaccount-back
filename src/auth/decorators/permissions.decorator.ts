import { SetMetadata } from "@nestjs/common";
import { Permission } from "../../permissions/dictionary/permissions.dictionary";

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...roles: Permission[]) => SetMetadata(PERMISSIONS_KEY, roles);
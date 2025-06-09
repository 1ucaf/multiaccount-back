import { Controller, Get, Inject } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(@Inject(PermissionsService) private permissionsService: PermissionsService) {}

  @Get()
  getPermissions() {
    return this.permissionsService.getPermissions();
  }
}

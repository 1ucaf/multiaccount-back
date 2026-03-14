import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GlobalSettingsService } from './global-settings.service';
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto';

@Controller('global-settings')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.MASTER)
export class GlobalSettingsController {
  constructor(private readonly service: GlobalSettingsService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Patch()
  update(@Body() dto: UpdateGlobalSettingsDto) {
    return this.service.update(dto);
  }
}

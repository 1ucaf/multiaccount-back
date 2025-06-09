import { Injectable } from '@nestjs/common';
import { AllPermissions } from 'src/permissions/dictionary/permissions.dictionary';

@Injectable()
export class PermissionsService {
  constructor() {}
  getPermissions() {
    return AllPermissions;
  }
}

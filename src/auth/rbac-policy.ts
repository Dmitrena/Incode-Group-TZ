import { RolesBuilder } from 'nest-access-control';
import { Role } from './enums';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

RBAC_POLICY.grant(Role.USER)
  .readOwn('userData')
  .grant(Role.BOSS)
  .extend(Role.USER)
  .update('changeBoss')
  .grant(Role.ADMIN)
  .extend(Role.BOSS);

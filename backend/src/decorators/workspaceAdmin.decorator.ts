import { SetMetadata } from '@nestjs/common';

export const CHECK_IF_ADMIN_MEMBER = 'checkIfAdminMember';
export const WorkspaceAdmin = () => SetMetadata(CHECK_IF_ADMIN_MEMBER, true);

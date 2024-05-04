import { Module } from '@nestjs/common';

import {
  WorkspaceController,
  WorkspaceMemberController,
  WorkspaceInvitationController,
} from './controllers';

import {
  WorkspaceService,
  WorkspaceMemberService,
  WorkspaceInvitationService,
} from './services';

@Module({
  imports: [],
  controllers: [
    WorkspaceController,
    WorkspaceMemberController,
    WorkspaceInvitationController,
  ],
  providers: [
    WorkspaceService,
    WorkspaceMemberService,
    WorkspaceInvitationService,
  ],
})
export class WorkspaceModule {}

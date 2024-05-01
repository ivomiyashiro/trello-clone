import { IsNotEmpty, IsString } from 'class-validator';
import { WorkspaceInvitationState } from '@prisma/client';

export class WorkspaceInvitationPutDto {
  @IsNotEmpty()
  @IsString()
  fromWorkspaceMemberId: string;

  @IsNotEmpty()
  @IsString()
  toUserId: string;

  @IsNotEmpty()
  @IsString()
  state: WorkspaceInvitationState;
}

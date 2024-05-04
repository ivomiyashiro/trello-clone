import { IsNotEmpty, IsString } from 'class-validator';

export class WorkspaceInvitationDto {
  @IsNotEmpty()
  @IsString()
  fromWorkspaceMemberId: string;

  @IsNotEmpty()
  @IsString()
  toUserId: string;
}

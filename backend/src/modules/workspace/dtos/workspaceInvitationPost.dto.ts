import { IsNotEmpty, IsString } from 'class-validator';

export class WorkspaceInvitationPostDto {
  @IsNotEmpty()
  @IsString()
  fromWorkspaceMemberId: string;

  @IsNotEmpty()
  @IsString()
  toUserId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WorkspaceInvitationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fromWorkspaceMemberId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toUserId: string;
}

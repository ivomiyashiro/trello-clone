import { IsNotEmpty, IsString } from 'class-validator';

export class WorkspaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

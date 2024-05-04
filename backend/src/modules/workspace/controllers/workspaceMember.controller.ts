import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators';
import { WorkspaceMemberService } from '../services';

@Controller('/api/workspace')
export class WorkspaceMemberController {
  constructor(private workspaceMemberService: WorkspaceMemberService) {}

  @Get('/:workspaceId/workspaceMembers/:workspaceMemberId')
  @HttpCode(HttpStatus.OK)
  async findManyWorkspaceMembers(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    try {
      const workspaceMembers =
        await this.workspaceMemberService.findManyWorkspaceMembers(
          userId,
          workspaceId,
        );

      return {
        ok: true,
        data: {
          workspaceMembers,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:workspaceId/workspaceMembers/:workspaceMemberId')
  @HttpCode(HttpStatus.OK)
  async deleteOneWorkspaceMember(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('workspaceMemberId') workspaceMemberId: string,
  ) {
    try {
      await this.workspaceMemberService.deleteOneWorkspaceMember(
        userId,
        workspaceId,
        workspaceMemberId,
      );

      return {
        ok: true,
        message: `Workspace member has been successfully removed.`,
      };
    } catch (error) {
      throw error;
    }
  }
}

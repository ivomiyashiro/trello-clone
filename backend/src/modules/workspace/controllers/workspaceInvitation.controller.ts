import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, WorkspaceAdmin } from 'src/decorators';
import { WorkspaceInvitationService } from '../services';
import { WorkspaceInvitationDto } from '../dtos';

@ApiTags('Workspace invitations')
@ApiBearerAuth()
@Controller('/api/workspaces')
export class WorkspaceInvitationController {
  constructor(private workspaceInvitationService: WorkspaceInvitationService) {}

  @Post('/:workspaceId/invitations')
  @WorkspaceAdmin()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspaceInvitation(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Body() workspaceInvitationPostDto: WorkspaceInvitationDto,
  ) {
    try {
      await this.workspaceInvitationService.createWorkspaceInvitation(
        userId,
        workspaceId,
        workspaceInvitationPostDto,
      );

      return {
        ok: true,
        message: `Invitation has been successfully sent.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/:workspaceId/invitations')
  @HttpCode(HttpStatus.OK)
  async findManyWorkspaceInvitations(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    try {
      const invitations =
        await this.workspaceInvitationService.findManyWorkspaceInvitations(
          userId,
          workspaceId,
        );

      return {
        ok: true,
        data: {
          invitations,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:workspaceId/invitations/:fromWorkspaceMemberId/:toUserId')
  @WorkspaceAdmin()
  @HttpCode(HttpStatus.OK)
  async deleteWorkspaceInvitation(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('fromWorkspaceMemberId') fromWorkspaceMemberId: string,
    @Param('toUserId') toUserId: string,
  ) {
    try {
      await this.workspaceInvitationService.deleteWorkspaceInvitation(
        userId,
        workspaceId,
        fromWorkspaceMemberId,
        toUserId,
      );

      return {
        ok: true,
        message: `Invitation has been successfully deleted.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/:workspaceId/invitations/:fromWorkspaceMemberId/:toUserId/accept')
  @HttpCode(HttpStatus.OK)
  async acceptWorkspaceInvitation(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('fromWorkspaceMemberId') fromWorkspaceMemberId: string,
    @Param('toUserId') toUserId: string,
  ) {
    try {
      await this.workspaceInvitationService.acceptWorkspaceInvitation(
        userId,
        workspaceId,
        fromWorkspaceMemberId,
        toUserId,
      );

      return {
        ok: true,
        message: `Invitation has been successfully accepted.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:workspaceId/invitations/:fromWorkspaceMemberId/:toUserId/reject')
  @WorkspaceAdmin()
  @HttpCode(HttpStatus.OK)
  async rejectWorkspaceInvitation(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') fromWorkspaceMemberId: string,
    @Param('workspaceId') toUserId: string,
  ) {
    try {
      await this.workspaceInvitationService.rejectWorkspaceInvitation(
        userId,
        fromWorkspaceMemberId,
        toUserId,
      );

      return {
        ok: true,
        message: `Invitation has been successfully rejected.`,
      };
    } catch (error) {
      throw error;
    }
  }
}

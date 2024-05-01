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
import { AuthUser } from 'src/decorators';
import { WorkspaceService } from './workspace.service';
import {
  WorkspaceDto,
  WorkspaceInvitationPostDto,
  WorkspaceInvitationPutDto,
} from './dtos';

@Controller('/api/workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOneWorkspace(
    @AuthUser('sub') userId: string,
    @Body() workspaceDto: WorkspaceDto,
  ) {
    try {
      const newWorkspace = await this.workspaceService.createOneWorkspace(
        userId,
        workspaceDto,
      );

      return {
        ok: true,
        data: {
          workspace: newWorkspace,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findManyWorkspaces(@AuthUser('sub') userId: string) {
    try {
      const workspaces = await this.workspaceService.findManyWorkspaces(userId);

      return {
        ok: true,
        data: {
          workspaces,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':workspaceId')
  @HttpCode(HttpStatus.OK)
  async updateOneWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Body() workspacePutDto: WorkspaceDto,
  ) {
    try {
      const workspaces = await this.workspaceService.updateOneWorkspace(
        workspaceId,
        workspacePutDto,
      );

      return {
        ok: true,
        data: {
          workspaces,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':workspaceId')
  @HttpCode(HttpStatus.OK)
  async deleteOneWorkspace(@Param('workspaceId') workspaceId: string) {
    try {
      await this.workspaceService.deleteOneWorkspace(workspaceId);

      return {
        ok: true,
        message: `Workspace with id ${workspaceId}'s been successfully deleted.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/:workspaceId/invitation')
  @HttpCode(HttpStatus.CREATED)
  async createWorkspaceInvitation(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Body() workspaceInvitationPostDto: WorkspaceInvitationPostDto,
  ) {
    try {
      await this.workspaceService.createWorkspaceInvitation(
        userId,
        workspaceId,
        workspaceInvitationPostDto,
      );

      return {
        ok: true,
        message: `Invitation's been successfully sent.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/:workspaceId/invitation')
  @HttpCode(HttpStatus.OK)
  async updateWorkspaceInvitation(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Body()
    workspaceInvitationPutDto: WorkspaceInvitationPutDto,
  ) {
    try {
      await this.workspaceService.updateWorkspaceInvitation(
        userId,
        workspaceId,
        workspaceInvitationPutDto,
      );

      return {
        ok: true,
        message: `Invitation's been successfully sent.`,
      };
    } catch (error) {
      throw error;
    }
  }

  // No estoy muy seguro de que este este bien, PROBAR
  @Delete('/:workspaceId/invitation')
  @HttpCode(HttpStatus.CREATED)
  async deleteWorkspaceInvitation(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Body()
    workspaceInvitationPostDto: WorkspaceInvitationPostDto,
  ) {
    try {
      await this.workspaceService.deleteWorkspaceInvitation(
        userId,
        workspaceId,
        workspaceInvitationPostDto,
      );

      return {
        ok: true,
        message: `Invitation's been successfully sent.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:workspaceId/:workspaceMemberId')
  @HttpCode(HttpStatus.CREATED)
  async deleteOneWorkspaceMember(
    @AuthUser('sub') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Param('workspaceMemberId') workspaceMemberId: string,
  ) {
    try {
      await this.workspaceService.deleteOneWorkspaceMember(
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

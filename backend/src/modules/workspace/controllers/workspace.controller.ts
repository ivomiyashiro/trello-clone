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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, WorkspaceAdmin } from 'src/decorators';
import { WorkspaceService } from '../services';
import { WorkspaceDto } from '../dtos';

@ApiTags('Workspace')
@ApiBearerAuth()
@Controller('/api/workspaces')
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

  @Get('/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async findOneWorkspace(
    @Param('workspaceId') workspaceId: string,
    @AuthUser('sub') userId: string,
  ) {
    try {
      const workspace = await this.workspaceService.findOneWorkspace(
        workspaceId,
        userId,
      );

      return {
        ok: true,
        data: {
          workspace,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/:workspaceId')
  @WorkspaceAdmin()
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

  @Delete('/:workspaceId')
  @WorkspaceAdmin()
  @HttpCode(HttpStatus.OK)
  async deleteOneWorkspace(@Param('workspaceId') workspaceId: string) {
    try {
      await this.workspaceService.deleteOneWorkspace(workspaceId);

      return {
        ok: true,
        message: `Workspace with id ${workspaceId} has been successfully deleted.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/:workspaceId/searchUsersToInvite')
  @WorkspaceAdmin()
  @HttpCode(HttpStatus.OK)
  async searchUsersToInvite(
    @Query('q') email: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    try {
      const user = await this.workspaceService.searchUsersToInvite(
        email,
        workspaceId,
      );

      return {
        ok: true,
        data: {
          user,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

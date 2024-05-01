import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import {
  WorkspaceDto,
  WorkspaceInvitationPostDto,
  WorkspaceInvitationPutDto,
} from './dtos';

@Injectable()
export class WorkspaceService {
  constructor(private prismaService: PrismaService) {}

  async createOneWorkspace(userId: string, { name }: WorkspaceDto) {
    const newWorkspace = await this.prismaService.workspace.create({
      data: {
        name,
        workspacesMembers: {
          create: {
            userId,
            role: 'admin', // If workspace doesn't exists the person who's creating it is the admin
          },
        },
      },
    });

    return newWorkspace;
  }

  async findManyWorkspaces(userId: string) {
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        workspacesMembers: {
          some: {
            userId,
          },
        },
      },
      include: {
        boards: true,
        workspacesMembers: true,
      },
    });

    return workspaces;
  }

  async updateOneWorkspace(workspaceId: string, { name }: WorkspaceDto) {
    const workspace = await this.prismaService.workspace.update({
      where: { id: workspaceId },
      data: { name },
    });

    return workspace;
  }

  async deleteOneWorkspace(workspaceId: string) {
    await this.prismaService.workspace.delete({
      where: { id: workspaceId },
    });
  }

  // Workspace invitations ==>
  async createWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    { fromWorkspaceMemberId, toUserId }: WorkspaceInvitationPostDto,
  ) {
    const workspaceAdmin = await this.prismaService.workspaceMember.findFirst({
      where: {
        role: 'admin',
        userId,
        workspaceId,
      },
    });

    if (workspaceAdmin === null) {
      throw new UnauthorizedException(
        'Only the workspace admin can send invitations.',
      );
    }

    await this.prismaService.workspaceInvitation.create({
      data: {
        fromWorkspaceMemberId: fromWorkspaceMemberId,
        toUserId: toUserId,
        state: 'pending',
      },
    });
  }

  async updateWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    { fromWorkspaceMemberId, toUserId, state }: WorkspaceInvitationPutDto,
  ) {
    // The invitation can only be updated by the person who received it.
    if (userId !== toUserId) {
      throw new UnauthorizedException(
        'The invitation can only be updated by the person who received it.',
      );
    }

    // User shouldn't be able to change state to pending
    if (state === 'pending') {
      throw new BadRequestException('State must be different than pending.');
    }

    await this.prismaService.workspaceInvitation.update({
      where: {
        id: {
          fromWorkspaceMemberId,
          toUserId,
        },
        user: {
          workspacesMember: {
            some: {
              workspaceId,
            },
          },
        },
      },
      data: { state },
    });

    await this.createOneWorkspaceMember(workspaceId, userId);
  }

  async deleteWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    { fromWorkspaceMemberId, toUserId }: WorkspaceInvitationPostDto,
  ) {
    const workspaceAdmin = await this.prismaService.workspaceMember.findUnique({
      where: {
        id: fromWorkspaceMemberId,
        role: 'admin',
        userId,
        workspaceId,
      },
    });

    // The invitation can only be deleted by its creator
    if (workspaceAdmin === null) {
      throw new UnauthorizedException(
        'The invitation can only be deleted by the admin.',
      );
    }

    const invitation = await this.prismaService.workspaceInvitation.delete({
      where: {
        id: {
          fromWorkspaceMemberId,
          toUserId,
        },
      },
    });

    return invitation;
  }

  // Workspace Members ==>
  async createOneWorkspaceMember(workspaceId: string, userId: string) {
    const member = await this.prismaService.workspaceMember.create({
      data: {
        userId,
        role: 'user',
        workspaceId,
      },
    });

    return member;
  }

  async deleteOneWorkspaceMember(
    userId: string,
    workspaceMemberId: string,
    workspaceId: string,
  ) {
    const workspaceAdmin = await this.prismaService.workspaceMember.findFirst({
      where: {
        role: 'admin',
        userId,
        workspaceId,
      },
    });

    if (workspaceAdmin === null) {
      throw new UnauthorizedException(
        'A member can only be removed by the workspace admin.',
      );
    }

    await this.prismaService.workspaceMember.delete({
      where: { id: workspaceMemberId, workspaceId },
    });
  }
}

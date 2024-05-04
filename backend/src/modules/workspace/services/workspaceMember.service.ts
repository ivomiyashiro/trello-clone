import { Injectable, UnauthorizedException } from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';

import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(private prismaService: PrismaService) {}

  async createOneWorkspaceMember(workspaceId: string, userId: string) {
    const member = await this.prismaService.workspaceMember.create({
      data: {
        userId,
        role: WorkspaceRole.user,
        workspaceId,
      },
    });

    return member;
  }

  async findManyWorkspaceMembers(userId: string, workspaceId: string) {
    const workspaceMembers = await this.prismaService.workspaceMember.findMany({
      where: { workspaceId },
    });

    const isMemberOfWorkspace = workspaceMembers.some(
      (member) => member.userId === userId,
    );

    if (!isMemberOfWorkspace) {
      throw new UnauthorizedException('You have to be part of the workspace.');
    }

    return workspaceMembers;
  }

  async deleteOneWorkspaceMember(
    userId: string,
    workspaceMemberId: string,
    workspaceId: string,
  ) {
    const workspaceAdmin = await this.getWorkspaceAdmin(workspaceId);

    if (workspaceAdmin.id === userId) {
      throw new UnauthorizedException(
        'A member can only be removed by the workspace admin.',
      );
    }

    await this.prismaService.workspaceMember.delete({
      where: { id: workspaceMemberId, workspaceId },
    });
  }

  async getWorkspaceAdmin(workspaceId: string) {
    const workspaceAdmin = await this.prismaService.workspace.findUnique({
      where: {
        id: workspaceId,
        workspacesMembers: {
          some: {
            role: WorkspaceRole.admin,
          },
        },
      },
    });

    return workspaceAdmin;
  }
}

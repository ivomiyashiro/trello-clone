import { Injectable } from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';

import { PrismaService } from 'src/lib/prisma/prisma.service';

import { WorkspaceDto } from '../dtos';

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
            role: WorkspaceRole.admin, // If workspace doesn't exists the person who's creating it is the admin
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

  async findOneWorkspace(workspaceId: string, userId: string) {
    const workspaces = await this.prismaService.workspace.findUnique({
      where: {
        id: workspaceId,
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

  async searchUsersToInvite(email: string, workspaceId: string) {
    const users = await this.prismaService.user.findMany({
      where: {
        email: {
          contains: email,
        },
        NOT: {
          workspacesMember: {
            some: {
              workspaceId,
            },
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }));
  }
}

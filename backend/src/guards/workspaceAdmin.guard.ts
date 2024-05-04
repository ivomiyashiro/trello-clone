import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WorkspaceRole } from '@prisma/client';

import { CHECK_IF_ADMIN_MEMBER } from 'src/decorators';

import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class WorkspaceAdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const checkIfAdminMember = this.reflector.getAllAndOverride(
      CHECK_IF_ADMIN_MEMBER,
      [context.getHandler(), context.getClass()],
    );

    if (!checkIfAdminMember) return true;

    const { user, params } = context.switchToHttp().getRequest();
    const workspaceId = params.workspaceId;
    const userId = user.sub;

    // Check if user is the admin of workspace
    const userAdminMember = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        workspacesMember: {
          some: {
            workspaceId,
            role: WorkspaceRole.admin,
          },
        },
      },
    });

    if (!workspaceId) return false;

    if (!userAdminMember) return false;

    return true;
  }
}

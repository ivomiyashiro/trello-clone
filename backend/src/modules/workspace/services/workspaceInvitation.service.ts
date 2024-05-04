import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkspaceInvitationState, WorkspaceRole } from '@prisma/client';

import { PrismaService } from 'src/lib/prisma/prisma.service';

import { WorkspaceMemberService } from './';
import { WorkspaceInvitationDto } from '../dtos';

@Injectable()
export class WorkspaceInvitationService {
  constructor(
    private prismaService: PrismaService,
    private workspaceMemberService: WorkspaceMemberService,
  ) {}

  async createWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    { fromWorkspaceMemberId, toUserId }: WorkspaceInvitationDto,
  ) {
    const workspaceAdmin = await this.workspaceMemberService.getWorkspaceAdmin(
      workspaceId,
    );

    if (workspaceAdmin.id === userId) {
      throw new UnauthorizedException(
        'Only the workspace admin can send invitations.',
      );
    }

    const invitationSent =
      await this.prismaService.workspaceInvitation.findUnique({
        where: {
          id: {
            fromWorkspaceMemberId,
            toUserId,
          },
        },
      });

    if (invitationSent) {
      throw new BadRequestException('Invitation has been already sent.');
    }

    await this.prismaService.workspaceInvitation.create({
      data: {
        fromWorkspaceMemberId,
        toUserId,
        state: WorkspaceInvitationState.pending,
      },
    });
  }

  async findManyWorkspaceInvitations(userId: string, workspaceId: string) {
    const invitations = await this.prismaService.workspaceInvitation.findMany({
      where: {
        user: {
          id: userId,
        },
        workspaceMember: {
          workspace: {
            id: workspaceId,
          },
        },
      },
    });

    return invitations;
  }

  // When the admin wants to delete an invitation that was sent.
  async deleteWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    fromWorkspaceMemberId: string,
    toUserId: string,
  ) {
    const workspaceAdmin = await this.prismaService.workspaceMember.findUnique({
      where: {
        id: fromWorkspaceMemberId,
        role: WorkspaceRole.admin,
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

    await this.prismaService.workspaceInvitation.delete({
      where: {
        id: {
          fromWorkspaceMemberId,
          toUserId,
        },
      },
    });
  }

  async acceptWorkspaceInvitation(
    userId: string,
    workspaceId: string,
    fromWorkspaceMemberId: string,
    toUserId: string,
  ) {
    // The invitation can only be updated by the person who received it.
    if (userId !== toUserId) {
      throw new UnauthorizedException(
        'The invitation can only be accepted by the person who received it.',
      );
    }

    await this.prismaService.workspaceInvitation.update({
      where: {
        id: {
          fromWorkspaceMemberId,
          toUserId,
        },
      },
      data: { state: WorkspaceInvitationState.accepted },
    });

    await this.workspaceMemberService.createOneWorkspaceMember(
      workspaceId,
      userId,
    );
  }

  async rejectWorkspaceInvitation(
    userId: string,
    fromWorkspaceMemberId: string,
    toUserId: string,
  ) {
    // The invitation can only be updated by the person who received it.
    if (userId !== toUserId) {
      throw new UnauthorizedException(
        'The invitation can only be rejected by the person who received it.',
      );
    }

    await this.prismaService.workspaceInvitation.delete({
      where: {
        id: {
          fromWorkspaceMemberId,
          toUserId,
        },
      },
    });
  }
}

import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findMany(@Param('id') userId: string) {
    try {
      const user = await this.userService.findUnique(userId);

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

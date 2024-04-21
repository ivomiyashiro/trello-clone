import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('/api/private')
export class PrivateController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get() {
    return {
      ok: true,
    };
  }
}

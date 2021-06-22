import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Req() req: Request): Promise<number[] | Error> {
    return this.usersService.getUsers(req);
  }

  @Get(':id')
  async getUser(@Req() req: Request, @Param('id') id: string): Promise<any> {
    return this.usersService.getUser(req, id);
  }
}

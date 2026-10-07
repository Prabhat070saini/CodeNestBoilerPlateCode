import { Controller, UseGuards, Get, Res, Param } from '@nestjs/common';
import { UserService } from './user.service';
// import { AuthnGuard } from '../../common/guards/auth.guard';
import { UtilsService } from '../../common/utils/utils.service';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { Role } from '../../common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiJwtAndApiKey } from '../../common/decorators/apiKey-jwt-swagger.decorator';
import { FastifyReply } from 'fastify';
// @UseGuards(AuthnGuard)
@ApiTags('User')
@ApiJwtAndApiKey()
@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
  ) {}
  @UseGuards(PermissionGuard)
  @Role('MST002')
  @Get(':userId')
  async getUserById(
    @Res() res: FastifyReply,
    @Param('userId') userId: string,
  ): Promise<void> {
    const output = await this.userService.findUserById(userId);
    this.utilsService.sendRestResponse(res, output);
  }
}

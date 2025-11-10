import { Controller, Post, Body, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { UtilsService } from 'src/common/utils/utils.service';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Response() res) {
    const output = await this.authService.signUp(signUpDto);
    console.log(output, 'output');
    return this.utilsService.sendRestResponse(res, output);
  }
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Response() res) {
    const output = await this.authService.signIn(signInDto);
    console.log(output, 'output');
    return this.utilsService.sendRestResponse(res, output);
  }
}

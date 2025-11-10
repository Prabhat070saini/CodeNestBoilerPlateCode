import {
  Controller,
  Post,
  Body,
  Response,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { UtilsService } from 'src/common/utils/utils.service';
import { AuthGuard } from '@nestjs/passport';
import { IsPublic } from 'src/common/decorators/public.decorator';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Response() res): Promise<void> {
    const output = await this.authService.signUp(signUpDto);
    console.log(output, 'output');
    return this.utilsService.sendRestResponse(res, output);
  }
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Response() res): Promise<void> {
    const output = await this.authService.signIn(signInDto);
    console.log(output, 'output');
    this.utilsService.sendRestResponse(res, output);
  }
  // Step 1: Redirect user to Google
  @IsPublic()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  // Step 2: Google redirects back here
  @IsPublic()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return {
      message: 'Login successful',
      user: req.user,
    };
  }
}

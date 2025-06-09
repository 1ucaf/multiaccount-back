import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get()
  @UseGuards(AuthGuard())
  getAuth(@Request() req) {
    return req.user;
  }
  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO): Promise<{token: string}> {
    return this.authService.signUp(signUpDTO);
  }
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<{token: string}> {
    return this.authService.login(loginDTO);
  }
}

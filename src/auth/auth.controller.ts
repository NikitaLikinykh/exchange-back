import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email и пароль обязательны');
    }
    return this.authService.register(email, password);
  }

  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Токен не предоставлен');
    }

    const user = await this.authService.confirmEmail(token);

    if (!user) {
      throw new BadRequestException('Неверный или истекший токен');
    }

    return { message: 'Email успешно подтвержден!' };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email и пароль обязательны');
    }
    return this.authService.login(email, password);
  }

  @Post('refresh')
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refreshToken(refreshToken);
  }
}

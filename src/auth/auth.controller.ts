import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('phone') phone: string,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email и пароль обязательны');
    }
    return this.authService.register(email, password, phone);
  }

  // @Get('confirm')
  // async confirmEmail(@Req() req: Request, @Res() res: Response) {
  //   const token = req.query.token as string;
  //   if (!token) {
  //     throw new BadRequestException('Токен не предоставлен');
  //   }

  //   const user = await this.authService.confirmEmail(token);

  //   if (!user) {
  //     throw new BadRequestException('Неверный или истекший токен');
  //   }

  //   return res.redirect('/login');
  // }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, expiresIn, phone } =
      await this.authService.login(email, password);

    res.cookie('email', email, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie('phone', phone, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('expires_in', expiresIn, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    // return { message: 'Успешный вход', expiresIn };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Выход выполнен' };
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    console.log(req);
    const cookies = req.cookies as { [key: string]: string };
    const token: string = cookies['access_token'];
    if (!token) throw new UnauthorizedException('Нет access_token');

    try {
      const payload: { sub: string } = this.jwtService.verify(token);
      const user = await this.authService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }
      return { email: user.email, id: user._id };
    } catch {
      throw new UnauthorizedException('Неверный токен');
    }
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as { refresh_token?: string };
    const token = cookies.refresh_token;
    if (!token) throw new UnauthorizedException('Нет refresh_token');

    const { newAccessToken } = await this.authService.refreshToken(token);

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Токен обновлён' };
  }
}

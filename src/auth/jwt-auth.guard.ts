import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.cookies)
      throw new UnauthorizedException('Cookies are not available');
    console.log(req.cookies);
    const token = req.cookies['access_token'];
    console.log('Token:', token);
    if (!token) throw new UnauthorizedException('Нет токена');

    try {
      const payload = this.jwtService.verify(token);
      req['user'] = payload; // можно использовать в контроллере
      return true;
    } catch {
      throw new UnauthorizedException('Неверный токен');
    }
  }
}

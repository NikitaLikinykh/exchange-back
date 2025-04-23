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

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.cookies)
      throw new UnauthorizedException('Cookies are not available');

    const cookies: Record<string, string> = req.cookies as Record<
      string,
      string
    >;
    const token = cookies['access_token'];

    if (!token) throw new UnauthorizedException('Нет токена');

    try {
      const payload = this.jwtService.verify<{ userId: string; email: string }>(
        token,
      );
      req['user'] = payload; // можно использовать в контроллере
      return Promise.resolve(true);
    } catch {
      throw new UnauthorizedException('Неверный токен');
    }
  }
}

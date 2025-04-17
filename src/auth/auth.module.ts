// filepath: /Users/nikitalikinih/Desktop/ob-back/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Импортируем UserModule
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    UserModule,
    JwtModule.register({ secret: 'default', signOptions: { expiresIn: '1h' } }),
  ], // Добавляем UserModule
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

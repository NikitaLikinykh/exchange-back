// filepath: /Users/nikitalikinih/Desktop/ob-back/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Импортируем UserModule

@Module({
  imports: [UserModule], // Добавляем UserModule
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// filepath: /Users/nikitalikinih/Desktop/ob-back/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module'; // Импортируем AuthModule

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://soprano:lSc6RC067uMrRxz8@ac-wx0fno9-shard-00-00.ymtvqyn.mongodb.net:27017,ac-wx0fno9-shard-00-01.ymtvqyn.mongodb.net:27017,ac-wx0fno9-shard-00-02.ymtvqyn.mongodb.net:27017/?replicaSet=atlas-81108c-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
    ),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.yourmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'your@email.com',
          pass: 'your_email_password',
        },
      },
      defaults: {
        from: '"Whitebird" <noreply@whitebird.io>',
      },
    }),
    AuthModule, // Добавляем AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

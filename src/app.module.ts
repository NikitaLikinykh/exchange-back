import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module'; // Импортируем AuthModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables globally available
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://soprano:lSc6RC067uMrRxz8@ac-wx0fno9-shard-00-00.ymtvqyn.mongodb.net:27017,ac-wx0fno9-shard-00-01.ymtvqyn.mongodb.net:27017,ac-wx0fno9-shard-00-02.ymtvqyn.mongodb.net:27017/?replicaSet=atlas-81108c-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
    ),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: configService.get<boolean>('SMTP_SECURE'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"Whitebird" <noreply@whitebird.io>',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule, // Добавляем AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

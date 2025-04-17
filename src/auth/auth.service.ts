import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User as UserInterface } from '../user/interfaces/user.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid'; // Исправленный импорт
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserInterface>,

    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    // Проверка на существование пользователя
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = uuidv4();

    // Создание нового пользователя
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      confirmationToken,
    });

    await newUser.save();

    // Генерация ссылки подтверждения
    const confirmUrl = `http://localhost:3000/auth/confirm?token=${confirmationToken}`;

    // Отправка письма
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Подтвердите вашу регистрацию',
        html: `<p>Подтвердите ваш email, перейдя по ссылке:</p><a href="${confirmUrl}">${confirmUrl}</a>`,
      });
    } catch (er) {
      console.error('Ошибка при отправке письма:'); // Логирование ошибки
      throw new BadRequestException(
        'Не удалось отправить письмо с подтверждением. Проверьте настройки SMTP.' +
          er,
      );
    }

    return { message: 'Письмо с подтверждением отправлено' };
  }

  async confirmEmail(token: string) {
    // Поиск пользователя по токену
    const user = await this.userModel.findOne({ confirmationToken: token });

    if (!user) {
      throw new BadRequestException('Неверный или истекший токен');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email уже подтвержден');
    }

    // Обновление статуса пользователя
    user.isEmailConfirmed = true;
    user.confirmationToken = undefined;
    await user.save();

    return { message: 'Email успешно подтвержден!' };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    if (!user.isEmailConfirmed) {
      throw new BadRequestException('Email не подтвержден');
    }

    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }
}

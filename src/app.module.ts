import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://soprano:lSc6RC067uMrRxz8@ac-wx0fno9-shard-00-00.ymtvqyn.mongodb.net:27017,ac-wx0fno9-shard-00-01.ymtvqyn.mongodb.net:27017,ac-wx0fno9-shard-00-02.ymtvqyn.mongodb.net:27017/?replicaSet=atlas-81108c-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

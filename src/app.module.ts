import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsController } from './pets/pets.controller';
import { Pet } from './pets/pet.entity';
import { MongoRepository, Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_CONNECTION_STRING,
      database: process.env.MONGODB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      logger: 'debug',
      logging: 'all',
    }),
  ],
  controllers: [AppController, PetsController],
  providers: [AppService],
})
export class AppModule {}

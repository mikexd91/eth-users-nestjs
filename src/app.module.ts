import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { configValidationSchema } from './config.schema';
import { User } from "./users/users.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.dev`], //comment
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        // url: configService.get('DATABASE_URL'),
        host: configService.get('DB_HOST'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        // ssl: true,
        // extra: {
        //   ssl: {
        //     rejectUnauthorized: true,
        //   },
        // },
      }),
    }),
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

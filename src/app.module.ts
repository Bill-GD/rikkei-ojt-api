import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as morgan from 'morgan';
import { join } from 'path';
import 'dotenv/config';
import typeOrmConfig from './config/typeOrmConfig';
import { BannerModule } from './banner/banner.module';
import { FestivalModule } from './festival/festival.module';

import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads-banner'),  
      serveRoot: '/uploads-banner', 
      serveStaticOptions: {
        fallthrough: false, 
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    BannerModule,
    AuthModule,
    FestivalModule,
    NewsModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('dev')).forRoutes('*');
  }
}
console.log('Kết nối tới DB:', {
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
});


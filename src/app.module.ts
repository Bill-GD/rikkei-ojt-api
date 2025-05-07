import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as morgan from 'morgan';
import { join } from 'path';
import 'dotenv/config';

import { KnexModule } from 'nest-knexjs';
import { UserModule } from './user/user.module';
import knexConfig from './config/knexConfig';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    UserModule,
    KnexModule.forRoot({ config: knexConfig.development }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log(join(__dirname, '..', 'public'));
    consumer.apply(morgan('dev')).forRoutes('*');
  }
}

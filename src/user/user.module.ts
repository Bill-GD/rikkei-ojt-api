import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExampleMiddleware } from '../common/middleware/example.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ExampleMiddleware).forRoutes('*');
  }
}

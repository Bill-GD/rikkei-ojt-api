import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as morgan from 'morgan';
import { join } from 'path';
import 'dotenv/config';
import typeOrmConfig from './config/typeOrmConfig';
import { BannerModule } from './banner/banner.module';
import { FestivalModule } from './festival/festival.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { TheaterModule } from './theater/theater.module';
import { UsersModule } from './users/users.module';
import { ScreenModule } from './screen/screen.module';
import { TicketModule } from './ticket/ticket.module';
import { MovieModule } from './movies/movie.module';
import { GenreModule } from './genre/genre.module';
import { SeatModule } from './seat/seat.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
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
    TheaterModule,
    ScreenModule,
    TicketModule,
    MovieModule,
    GenreModule,
    SeatModule,
    ShowtimeModule,
    BookingModule,
    PaymentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('dev')).forRoutes('*');
  }
}

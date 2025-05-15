import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { Movie } from '../movies/entities/movie.entity';
import { Screen } from '../screen/entities/screen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie, Screen])],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
})
export class ShowtimeModule {}

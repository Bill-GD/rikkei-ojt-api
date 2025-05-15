import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { GenreService } from '../genre/genre.service';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])],
  controllers: [MovieController],
  providers: [MovieService, GenreService],
})
export class MovieModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}

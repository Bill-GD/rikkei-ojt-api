import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Genre } from '../../genre/entities/genre.entity';
import { Movie } from './movie.entity';

@Entity()
export class MovieGenre {
  @PrimaryColumn()
  movie_id: number;

  @PrimaryColumn()
  genre_id: number;

  @ManyToOne(() => Movie, (movie) => movie.movieGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Genre, (genre) => genre.movieGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;
}

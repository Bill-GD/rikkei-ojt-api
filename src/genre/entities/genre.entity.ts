import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  genre_name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
}

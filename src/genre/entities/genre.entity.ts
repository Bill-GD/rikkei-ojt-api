import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'genre_name', type: 'varchar', length: 255 })
  genreName: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
}

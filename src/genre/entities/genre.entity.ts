import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { MovieGenre } from '../../movies/entities/movie-genre.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  genre_name: string;

  @ManyToMany(() => MovieGenre, (mg) => mg.genre)
  movieGenres: MovieGenre[];
}

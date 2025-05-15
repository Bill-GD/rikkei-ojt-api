import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MovieGenre } from './movie-genre.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  descriptions?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trailer?: string;

  @Column({ type: 'enum', enum: ['2D', '3D'] })
  type: string;

  @Column({ type: 'int' })
  duration_min: number;

  @Column({ type: 'datetime' })
  release_date: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;

  @OneToMany(() => MovieGenre, (mg) => mg.movie)
  movieGenres: MovieGenre[];
}

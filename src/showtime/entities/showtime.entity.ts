import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Screen } from '../../screen/entities/screen.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  screen_id: number;

  @Column()
  movie_id: number;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Screen)
  @JoinColumn({ name: 'screen_id' })
  screen: Screen;
}

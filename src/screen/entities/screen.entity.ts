import { Theater } from 'src/theater/entities/theater.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Showtime } from '../../showtime/entities/showtime.entity';

@Entity('screen')
export class Screen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column()
  seat_capacity: number;

  @OneToMany(() => Seat, (seat) => seat.screen, {
    onDelete: 'CASCADE',
  })
  seats: Seat[];

  @ManyToOne(() => Theater, (theater) => theater.screens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'theater_id' })
  theater: Theater;

  @Column('int')
  theater_id: number;

  @OneToMany(() => Showtime, (s) => s.screen)
  showtimes: Showtime[];

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;
}

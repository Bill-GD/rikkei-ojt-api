import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Screen } from 'src/screen/entities/screen.entity';
import SeatType from './seat-type.enum';

@Entity('seat')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  screen_id: number;

  @Column({ length: 50 })
  seat_number: string;

  @Column({ default: false })
  is_booked: boolean;

  @Column({ type: 'enum', enum: SeatType })
  type: string;

  @ManyToOne(() => Screen, (screen) => screen.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'screen_id' })
  screen: Screen;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;
}

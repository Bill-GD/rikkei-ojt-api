import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Showtime } from '../../showtime/entities/showtime.entity';
import { User } from '../../users/entities/user/user.entity';
import { BookingSeat } from './booking-seat-entity';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int')
  user_id: number;

  @ManyToOne(() => Showtime, (st) => st.bookings)
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;

  @Column('int')
  showtime_id: number;

  @Column('int')
  total_seat: number;

  @Column('double')
  total_price_movie: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;

  @OneToMany(() => BookingSeat, (bs) => bs.booking)
  booking_seats: BookingSeat[];
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Seat } from '../../seat/entities/seat.entity';
import { Booking } from './booking.entity';

@Entity()
export class SeatBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (b) => b.booking_seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => Seat, (s) => s.booking_seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @Column('int')
  quantity: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;
}

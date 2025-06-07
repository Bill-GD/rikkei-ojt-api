import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, length: 11 })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;

  @Column({ type: 'enum', enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'BLOCKED';

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles?: UserRole[];

  roles: string[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}

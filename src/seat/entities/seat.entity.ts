import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: ['STANDARD', 'VIP', 'SWEETBOX'],
  })
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}

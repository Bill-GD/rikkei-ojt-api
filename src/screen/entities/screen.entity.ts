import { Theater } from 'src/theater/entities/theater.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { number } from 'zod';

@Entity('screen')
export class Screen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column()
  seat_capacity: number;

  @ManyToOne(() => Theater, (theater) => theater.screen, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'theater_id' })
  theater: Theater;

  @Column('int')
  theater_id: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;
}

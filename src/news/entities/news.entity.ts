import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Festival } from '../../festival/entities/festival.entity';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('longtext')
  content: string;

  @ManyToOne(() => Festival, (fes) => fes.news, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'festival_id' })
  festival: Festival;

  @Column('int')
  festival_id: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;
}

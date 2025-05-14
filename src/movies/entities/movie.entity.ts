import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  type: '2D' | '3D';

  @Column({ type: 'int' })
  duration_min: number;

  @Column({ type: 'datetime' })
  release_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

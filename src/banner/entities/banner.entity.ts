import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banner')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'enum', enum: ['image', 'video'] })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  position: string;
}

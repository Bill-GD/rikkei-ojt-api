import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  type: string;

  @Column()
  position: string;
}

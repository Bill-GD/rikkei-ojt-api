import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'genre_name', type: 'varchar', length: 255 })
  genreName: string;
}

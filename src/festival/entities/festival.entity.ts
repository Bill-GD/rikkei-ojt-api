import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { News } from '../../news/entities/news.entity';

@Entity('festival')
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'datetime', nullable: true })
  start_time: Date;

  @Column({ type: 'datetime', nullable: true })
  end_time: Date;

  @OneToMany(() => News, (news) => news.festival)
  news: News[];
}

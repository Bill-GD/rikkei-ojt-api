import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Screen } from 'src/screen/entities/screen.entity';

@Entity('theater')
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 11 })
  phone: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date | null;

  @OneToMany(() => Screen, (screen) => screen.theater)
  screen: Screen[];
}

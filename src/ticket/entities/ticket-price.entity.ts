import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BitBoolTransformer } from '../../common/utils/bit-bool-transformer';

export enum SeatType {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  SWEETBOX = 'SWEETBOX',
}

export enum MovieType {
  TWO_D = '2D',
  THREE_D = '3D',
}

@Entity('ticket_price')
export class TicketPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SeatType })
  type_seat: SeatType;

  @Column({ type: 'enum', enum: MovieType })
  type_movie: MovieType;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'bit', transformer: new BitBoolTransformer() })
  // 0 - ngày thường; 1 - cuối tuần/ngày lễ
  day_type: boolean;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;
}

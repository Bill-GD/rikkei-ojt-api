import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '../dto/payment-method.enum';
import { PaymentStatus } from '../dto/payment-status.enum';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  booking_id: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus })
  payment_status: PaymentStatus;

  @Column('double')
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  transaction_id: string;
}

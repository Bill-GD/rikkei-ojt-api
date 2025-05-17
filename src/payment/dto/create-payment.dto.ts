import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { PaymentMethod } from './payment-method.enum';
import { PaymentStatus } from './payment-status.enum';

export class CreatePaymentDto {
  @ApiProperty({ type: 'integer', example: 1 })
  @IsInt()
  @IsPositive()
  booking_id: number;

  @ApiProperty({ type: 'string', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  payment_status: PaymentStatus;
  amount: number;
  transaction_id: string;
}

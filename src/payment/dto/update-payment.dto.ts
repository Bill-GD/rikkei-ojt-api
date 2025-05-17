import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PaymentStatus } from './payment-status.enum';

export class UpdatePaymentDto {
  @ApiProperty({ type: 'string', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;
}

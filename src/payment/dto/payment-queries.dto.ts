import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';
import { PaymentMethod } from './payment-method.enum';
import { PaymentStatus } from './payment-status.enum';

export class PaymentQueries extends CommonQueries {
  @ApiPropertyOptional({
    name: 'sort',
    enum: ['id', 'payment_time', 'amount'],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum(['id', 'payment_time', 'amount'])
  declare sort?: string;

  @ApiPropertyOptional({ type: 'string', enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  payment_method?: PaymentMethod;

  @ApiPropertyOptional({ type: 'string', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsString()
  transaction_id?: string;
}

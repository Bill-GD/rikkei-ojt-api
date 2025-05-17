import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentQueries } from './dto/payment-queries.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  create(dto: CreatePaymentDto) {
    return this.paymentRepo.save(dto);
  }

  findAll(query: PaymentQueries) {
    query = plainToInstance(PaymentQueries, query);

    const { payment_method, payment_status, transaction_id } = query;

    const where: FindOptionsWhere<Payment>[] = [];
    if (payment_method) where.push({ payment_method });
    if (payment_status) where.push({ payment_status });
    if (transaction_id) where.push({ transaction_id });

    return this.paymentRepo.find({
      where,
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
    });
  }

  findOne(id: number) {
    return this.paymentRepo.findOneBy({ id });
  }

  update(id: number, dto: UpdatePaymentDto) {
    return this.paymentRepo.update(id, dto);
  }

  remove(id: number) {
    return this.paymentRepo.delete(id);
  }
}

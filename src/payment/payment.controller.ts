import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { BookingService } from '../booking/booking.service';
import { ServiceResponse } from '../common/model/service-response';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentQueries } from './dto/payment-queries.dto';
import { PaymentStatus } from './dto/payment-status.enum';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly bookingService: BookingService,
  ) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async create(@Body() dto: CreatePaymentDto) {
    dto.payment_status = PaymentStatus.PENDING;

    if (!(await this.bookingService.findOne(dto.booking_id))) {
      throw new NotFoundException(`Booking #${dto.booking_id} not found`);
    }

    const newPayment = await this.paymentService.create(dto);
    return ServiceResponse.success(
      'New pending payment added successfully',
      { id: newPayment.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiExtraModels(PaymentQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: PaymentQueries) {
    const payments = await this.paymentService.findAll(query);
    return ServiceResponse.success('Fetched all payments', payments);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const payment = await this.paymentService.findOne(id);
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return ServiceResponse.success(`Fetched payment #${id}`, payment);
  }

  @Patch(':id')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
  ) {
    await this.findOne(id);
    await this.paymentService.update(id, dto);
    return ServiceResponse.success(`Updated payment #${id} successfully`, null);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.paymentService.remove(id);
    return ServiceResponse.success(`Deleted payment #${id} successfully`, null);
  }
}

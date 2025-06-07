import { Module } from '@nestjs/common';
import { Seat } from '../seat/entities/seat.entity';
import { SeatService } from '../seat/seat.service';
import { ScreenService } from './screen.service';
import { ScreenController } from './screen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screen } from './entities/screen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Screen, Seat])],
  controllers: [ScreenController],
  providers: [ScreenService, SeatService],
})
export class ScreenModule {}

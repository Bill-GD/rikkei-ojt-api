import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../news/entities/news.entity';
import { NewsService } from '../news/news.service';
import { Festival } from './entities/festival.entity';
import { FestivalService } from './festival.service';
import { FestivalController } from './festival.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Festival, News])],
  controllers: [FestivalController],
  providers: [FestivalService, NewsService],
})
export class FestivalModule {}

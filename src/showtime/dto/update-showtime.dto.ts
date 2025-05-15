import { PartialType } from '@nestjs/swagger';
import { CreateShowtimeDto } from './create-showtime.dto';

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {
  screen_id?: number;
  movie_id?: number;
  start_time?: Date;
  end_time?: Date;
}


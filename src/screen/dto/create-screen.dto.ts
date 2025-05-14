import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateScreenDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    seat_capacity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    theater_id: number;
}

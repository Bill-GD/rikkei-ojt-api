import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponse<T = null> {
  @ApiProperty({ type: 'boolean' })
  readonly success: boolean;

  @ApiProperty({ type: 'string' })
  readonly message: string;

  @ApiProperty({ type: 'number', example: 200 })
  readonly statusCode: number;

  @ApiProperty()
  readonly responseObject: T;

  private constructor(
    success: boolean,
    message: string,
    responseObject: T,
    statusCode: number,
  ) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    responseObject: T,
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    return new ServiceResponse(true, message, responseObject, statusCode);
  }

  static failure<T>(
    message: string,
    responseObject: T,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    return new ServiceResponse(false, message, responseObject, statusCode);
  }
}

// export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
//   z.object({
//     success: z.boolean(),
//     message: z.string(),
//     responseObject: dataSchema.optional(),
//     statusCode: z.number(),
//   });

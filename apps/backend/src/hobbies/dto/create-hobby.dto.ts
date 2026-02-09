/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateHobbyDto {
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  hobbies: string;
}

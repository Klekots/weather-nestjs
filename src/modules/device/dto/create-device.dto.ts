import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDeviceDTO {
  @IsNotEmpty()
  @IsNumber()
  lat: number;
  @IsNotEmpty()
  @IsNumber()
  lng: number;
}

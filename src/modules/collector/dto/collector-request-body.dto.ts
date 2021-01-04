import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class IneerObject {
  @IsString()
  type: string;
  @IsNumber()
  data: number;
}

export class CollectorRequestBody {
  @IsNotEmpty()
  device_id: number;
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IneerObject)
  sensors: IneerObject[];
}

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { isInt } from '../utils/is-int';

@Injectable()
export class IdNumberCheckPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isInt(value)) {
      if (value > 0) {
        return value;
      } else {
        throw new BadRequestException('Please provide id is more 0');
      }
    } else {
      throw new BadRequestException('Please provide id as number type');
    }
  }
}

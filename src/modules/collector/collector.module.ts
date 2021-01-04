import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collector } from './collector.entity';
import { Device } from '../device/device.entity';
import { CollectorController } from './collector.controller';
import { CollectorService } from './collector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Collector])],
  controllers: [CollectorController],
  providers: [CollectorService],
})
export class CollectorModule {}

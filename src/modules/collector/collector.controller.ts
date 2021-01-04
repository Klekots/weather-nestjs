import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IdNumberCheckPipe } from 'src/pipes/id-number-check.pipe';
import { CollectorService } from './collector.service';
import { CollectorRequestBody } from './dto/collector-request-body.dto';

@Controller('collector')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @Get('/avg_temperature/:id')
  getAvgTemperature(@Param('id', IdNumberCheckPipe) id: number) {
    return this.collectorService.getAvgTemperature(id);
  }

  @Get('/avg_data_by_hourse/:id')
  getDataPerDay(@Param('id', IdNumberCheckPipe) id: number) {
    return this.collectorService.getAvgDataByHours(id);
  }

  @Get('/:id')
  getReport(@Param('id', IdNumberCheckPipe) id: number) {
    return this.collectorService.getStatByDeviceID(id);
  }

  @Post()
  setInfoWithDevice(@Body() body: CollectorRequestBody) {
    return this.collectorService.setInfoWithDevice(body);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDTO } from './dto/create-device.dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  getAllDevices(@Body() body: CreateDeviceDTO) {
    return this.deviceService.createDevice(body);
  }
}

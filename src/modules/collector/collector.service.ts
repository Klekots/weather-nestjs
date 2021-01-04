import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Repository } from 'typeorm';
import { Collector } from './collector.entity';
import { Device } from '../device/device.entity';

import {
  currentTimeISO,
  currentTimeString,
  dayAgoISO,
  dayAgoString,
  formatDate,
} from '../../utils/date-helpers';

@Injectable()
export class CollectorService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Collector)
    private readonly collectorRepository: Repository<Collector>,
  ) {}

  async setInfoWithDevice(body) {
    const { device_id } = body;
    if (!(await this.isDeviceExists(device_id))) {
      throw new NotFoundException(`Device with id:${device_id} not fount`);
    } else {
      return this.collectorRepository.save(body);
    }
  }

  async getStatByDeviceID(id: number) {
    if (!(await this.isDeviceExists(id))) {
      throw new NotFoundException(`Device with id:${id} not fount`);
    } else {
      const count = await this.collectorRepository.count({
        where: {
          device_id: Equal(id),
        },
      });
      if (count === 0) {
        return {
          count: 0,
          lastResultDate: null,
        };
      }
      const [result] = await this.collectorRepository.find({
        where: {
          device_id: Equal(id),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
        select: ['created_at'],
      });
      return {
        count,
        lastResultDate: formatDate(result.created_at),
      };
    }
  }

  async getAvgTemperature(id: number) {
    if (!(await this.isDeviceExists(id))) {
      throw new NotFoundException(`Device with id:${id} not fount`);
    } else {
      const result = await this.collectorRepository.find({
        where: {
          device_id: Equal(id),
          created_at: Between(dayAgoISO(), currentTimeISO()),
        },
      });
      if (result.length) {
        let counter = 0;
        let temperature = 0;

        for (let i = 0; i < result.length; i++) {
          result[i].sensors.find((res) => {
            if (res.type === 'temperature') {
              ++counter;
              temperature += res.data;
            }
          });
        }
        if (counter === 0) {
          throw new HttpException(`Not found sensor type: 'temperature'`, 404);
        } else {
          return Math.round(temperature / counter);
        }
      } else {
        throw new NotFoundException(
          `Not found results in range: ${dayAgoString()} and ${currentTimeString()}`,
        );
      }
    }
  }

  async getAvgDataByHours(id: number) {
    if (!(await this.isDeviceExists(id))) {
      throw new NotFoundException(`Device with id:${id} not fount`);
    } else {
      const resultArray = [];

      const result = await this.collectorRepository
        .query(
          `
      SELECT EXTRACT(hour from created_at) AS hour,
      json_agg(sensors) as sensors
      FROM collector 
      WHERE created_at BETWEEN $1 AND $2 AND device_id = $3
      GROUP BY 1
      ORDER BY 1`,
          [dayAgoISO(), currentTimeISO(), id],
        )
        .then((r) => r);

      if (result.length === 0) {
        return [];
      }

      for (let i = 0; i < result.length; i++) {
        let temperature = 0;
        let humidity = 0;
        let pressure = 0;
        let hour = result[i].hour;
        let count = 0;

        const helper = (data, type: string): any => {
          return JSON.parse(data).find((item) => {
            if (item.type === type) {
              return item;
            }
          });
        };

        for (let j = 0; j < result[i].sensors.length; j++) {
          temperature += helper(result[i].sensors[j], 'temperature').data;
          humidity += helper(result[i].sensors[j], 'humidity').data;
          pressure += helper(result[i].sensors[j], 'pressure').data;
          ++count;
        }

        resultArray.push({
          hour,
          temperature: Math.round(temperature / count),
          humidity: Math.round(humidity / count),
          pressure: Math.round(pressure / count),
        });
      }

      return resultArray;
    }
  }

  private async isDeviceExists(id: number) {
    const res = await this.deviceRepository.findOne({
      where: {
        id: Equal(id),
      },
    });
    if (res) {
      return true;
    }
    return false;
  }
}

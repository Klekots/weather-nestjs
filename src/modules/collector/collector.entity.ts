import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from '../device/device.entity';

@Entity()
export class Collector {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Device, (device) => device.id)
  @JoinColumn({ name: 'device_id' })
  device_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column('simple-json')
  sensors: { type: string; data: number }[];
}

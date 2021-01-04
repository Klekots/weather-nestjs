import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  lat: number;

  @Column({ nullable: false })
  lng: number;
}

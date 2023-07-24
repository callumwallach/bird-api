import { House } from '../house/house.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Residency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  birds: number;

  @Column({ default: 0 })
  eggs: number;

  @ManyToOne(() => House, (house) => house.residencyHistory)
  house: House;

  @CreateDateColumn()
  created_at: Date;
}

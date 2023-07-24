import { Residency } from '../residency/residency.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class House {
  @PrimaryColumn()
  id: string;

  @Column()
  ubid: string;

  @Column()
  name: string;

  @Column()
  lng: string;

  @Column()
  lat: string;

  @OneToOne(() => Residency, { eager: true })
  @JoinColumn({ name: 'currentResidency', referencedColumnName: 'id' })
  currentResidency: Residency;

  @OneToMany(() => Residency, (residency) => residency.house)
  residencyHistory: Residency[];

  @Column()
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

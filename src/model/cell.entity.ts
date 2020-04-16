import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'cell' })
export class Cell extends BaseEntity {
  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'varchar' })
  lock: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  data: string;
}
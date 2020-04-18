import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'syncstat' })
export class SyncStat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('bigint')
  tip: number;
}

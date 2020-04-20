import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cell' })
export class Cell {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  capacity: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  txHash: string;

  @Column({ type: 'varchar' })
  index: string;

  @Column({ type: 'boolean' })
  isLive: boolean;
}
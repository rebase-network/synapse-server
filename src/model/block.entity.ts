import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'block' })
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 66 })
  hash: string;

  @Column('bigint', { default: 0 })
  number: number;

  @Column('bigint', { default: 0 })
  epochNumber: number;

  @Column('bigint', { default: 0 })
  epochIndex: number;

  @Column('bigint', { default: 0 })
  epochLength: number;

  @Column('integer')
  timestamp: number;

  @Column('integer')
  transactionCount: number;

  @Column('varchar', { length: 66 })
  dao: string;
}

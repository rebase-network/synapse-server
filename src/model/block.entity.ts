import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'block' })
export class Block {
  @PrimaryGeneratedColumn()
  number: number;

  @Column('varchar', { length: 66 })
  hash: string;

  @Column('bigint', { default: 0 })
  epochNumber: number;

  @Column('bigint', { default: 0 })
  epochIndex: number;

  @Column('bigint', { default: 0 })
  epochLength: number;

  @Column('bigint')
  timestamp: number;

  @Column('varchar', { length: 66 })
  dao: string;

  @Column('integer')
  transactionCount: number;
}

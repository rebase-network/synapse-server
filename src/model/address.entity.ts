import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column('varchar')
  // pubKeyHash: string;

  // @Column('varchar')
  // lockHash: string;

  @Column('varchar')
  address: string;

  @Column('bigint', { default: 0 })
  balance: bigint;

  // @Column('bigint', { default: 0 })
  // liveCellCount: number;

  // @Column('bigint', { default: 0 })
  // txCount: number;
}

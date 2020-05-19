import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column('varchar')
  lockHash: string;

  @Column('bigint', { default: 0 })
  capacity: bigint;

  @Column({ type: 'varchar' })
  lockArgs: string;

  @Column({ type: 'varchar' })
  lockCodeHash: string;

  @Column({ type: 'varchar' })
  lockHashType: string;

  // @Column('bigint', { default: 0 })
  // cellsCount: number;

  // @Column('bigint', { default: 0 })
  // txCount: number;

}

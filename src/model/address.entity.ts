import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index("idx-address-lockHash")
  @Column('varchar')
  lockHash: string;

  @Column('bigint', { default: 0 })
  capacity: bigint;

  @Index("idx-address-lockArgs")
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

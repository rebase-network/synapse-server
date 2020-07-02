/*
 * @Author: your name
 * @Date: 2020-05-21 14:08:44
 * @LastEditTime: 2020-05-21 14:10:48
 */
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'cell' })
export class Cell {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  blockNumber: number;

  @Index("idx-cell-blockHash")
  @Column({ type: 'varchar' })
  blockHash: string;

  @Column('bigint')
  timestamp: number;

  @Column({ type: 'bigint' })
  capacity: number;

  @Column({ type: 'varchar' })
  address: string;

  // outPoint
  @Index("idx-cell-txHash")
  @Column({ type: 'varchar' })
  txHash: string;

  // outPoint
  @Column({ type: 'varchar' })
  index: string;

  @Column({ type: 'varchar' })
  status: string;

  @Index("idx-cell-lockHash")
  @Column({ type: 'varchar' })
  lockHash: string;

  @Index("idx-cell-lockArgs")
  @Column({ type: 'varchar' })
  lockArgs: string;

  @Column({ type: 'varchar' })
  lockCodeHash: string;

  @Column({ type: 'varchar' })
  lockHashType: string;

  @Index("idx-cell-typeHash")
  @Column({ type: 'varchar', default: null, nullable: true } )
  typeHash: string;

  @Index("idx-cell-typeArgs")
  @Column({ type: 'varchar', default: null, nullable: true } )
  typeArgs: string;

  @Index("idx-cell-typeCodeHash")
  @Column({ type: 'varchar', default: null, nullable: true } )
  typeCodeHash: string;

  @Column({ type: 'varchar', default: null, nullable: true } )
  typeHashType: string;

  @Column({ type: 'varchar' })
  outputData: string;

  @Column({ type: 'varchar' })
  outputDataHash: string;

}

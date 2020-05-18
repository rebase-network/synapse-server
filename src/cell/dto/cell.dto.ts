import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { Cell } from '../../model/cell.entity';

export class CellDTO implements Readonly<CellDTO> {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  capacity: number;

  @ApiProperty({ required: false })
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  txHash: string;

  @ApiProperty({ required: true })
  @IsString()
  index: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  status: string;

  public static from(dto: Partial<CellDTO>) {
    const it = new CellDTO();
    it.id = dto.id;
    it.address = dto.address;
    it.capacity = dto.capacity;
    it.txHash = dto.txHash;
    it.index = dto.index;
    it.status = dto.status;
    return it;
  }

  public static fromEntity(entity: Cell) {
    return this.from({
      id: entity.id,
      address: entity.address,
      capacity: entity.capacity,
      txHash: entity.txHash,
      index: entity.index,
      status: entity.status,
    });
  }

  public toEntity() {
    const it = new Cell();
    it.id = this.id;
    it.address = this.address;
    it.capacity = this.capacity;
    it.txHash = this.txHash;
    it.index = this.index;
    it.status = this.status;
    return it;
  }
}
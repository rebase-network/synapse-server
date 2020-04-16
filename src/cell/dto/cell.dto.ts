import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, } from 'class-validator';
import { Cell } from '../../model/cell.entity';

export class CellDTO implements Readonly<CellDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  capacity: number;

  @ApiProperty({ required: false })
  @IsString()
  data: string;

  @ApiProperty({ required: true })
  @IsString()
  lock: string;

  @ApiProperty({ required: true })
  @IsString()
  type: string;

  public static from(dto: Partial<CellDTO>) {
    const it = new CellDTO();
    it.id = dto.id;
    it.data = dto.data;
    it.lock = dto.lock;
    it.type = dto.type;
    it.capacity = dto.capacity;
    return it;
  }

  public static fromEntity(entity: Cell) {
    return this.from({
      id: entity.id,
      data: entity.data,
      lock: entity.lock,
      type: entity.type,
      capacity: entity.capacity
    });
  }

  public toEntity() {
    const it = new Cell();
    it.id = this.id;
    it.data = this.data;
    it.lock = this.lock;
    it.type = this.type;
    it.capacity = this.capacity;
    it.createDateTime = new Date();
    return it;
  }
}
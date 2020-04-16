import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, } from 'class-validator';
import { Cell } from '../../model/cell.entity';
import { User } from '../../user.decorator';

export class CellDTO implements Readonly<CellDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;


  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  description: string;

  public static from(dto: Partial<CellDTO>) {
    const it = new CellDTO();
    it.id = dto.id;
    it.name = dto.name;
    it.description = dto.description;
    return it;
  }

  public static fromEntity(entity: Cell) {
    return this.from({
      id: entity.id,
      name: entity.name,
      description: entity.description
    });
  }

  public toEntity(user: User = null) {
    const it = new Cell();
    it.id = this.id;
    it.name = this.name;
    it.description = this.description;
    it.createDateTime = new Date();
    it.lastChangedBy = user ? user.id : null;
    return it;
  }
}
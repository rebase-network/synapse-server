import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UdtsDTO {

  @IsArray()
  @ApiProperty({
    description: 'typeHashes',
    isArray: true,
    type: String,
    required: false
  })
  typeHashes: string[];
}

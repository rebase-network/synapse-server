import { ApiProperty } from '@nestjs/swagger';

export class UnSpentCellsDTO {
  @ApiProperty({
    description: 'lockHash',
  })
  lockHash: string;

  @ApiProperty({
    description: 'typeHash',
    required: false
  })
  typeHash?: string;

  @ApiProperty({
    description: 'Number of transactions',
    required: false
  })
  limit?: string;

  @ApiProperty({
    description: 'needed capacity',
    required: false
  })
  capacity?: string;

  @ApiProperty({
    description: 'Contains data or not',
    required: false
  })
  hasData?: string;
}

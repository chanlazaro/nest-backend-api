import { ApiProperty } from '@nestjs/swagger';

export class SingleResponseDto {
  @ApiProperty({ description: 'any data' })
  data: string | object;

  constructor(data: string | object) {
    this.data = data;
  }
}

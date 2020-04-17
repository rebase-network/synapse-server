import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockService {
  sync(): string[] {
    return ['block']
  }
}

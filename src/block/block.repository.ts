import { Repository, EntityRepository } from 'typeorm';
import { Block } from '../model/block.entity';

@EntityRepository(Block)
export class BlockRepository extends Repository<Block> {
    
}

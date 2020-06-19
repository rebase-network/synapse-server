import { Repository, EntityRepository } from 'typeorm';
import { SyncStat } from '../model/syncstat.entity';

@EntityRepository(SyncStat)
export class SyncstatRepository extends Repository<SyncStat> {

}

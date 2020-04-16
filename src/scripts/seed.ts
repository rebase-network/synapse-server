import * as _ from 'lodash';
import { createConnection, ConnectionOptions } from 'typeorm';
import { configService } from '../config/config.service';
import { CellService } from '../cell/cell.service';
import { Cell } from '../model/cell.entity';
import { CellDTO } from '../cell/dto/cell.dto';

async function run() {
  const seedId = Date.now()
    .toString()
    .split('')
    .reverse()
    .reduce((s, it, x) => (x > 3 ? s : (s += it)), '');

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true
  };

  const connection = await createConnection(opt as ConnectionOptions);
  const cellService = new CellService(connection.getRepository(Cell));

  const work = _.range(1, 10)
    .map(n => CellDTO.from({
      data: `seed${seedId}-${n}`,
      lock: 'lock script',
      type: 'type script',
      capacity: 100 * n
    }))
    .map(dto => cellService.create(dto)
      .then(r => (console.log('done ->', r.capacity), r)))

  return await Promise.all(work);
}

run()
  .then(_ => console.log('...wait for script to exit'))
  .catch(error => console.error('seed error', error));
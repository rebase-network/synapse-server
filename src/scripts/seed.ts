// import { HttpService } from '@nestjs/common';
// import * as _ from 'lodash';
// import { createConnection, ConnectionOptions } from 'typeorm';
// import { configService } from '../config/config.service';
// import { CellService } from '../cell/cell.service';
// import { Cell } from '../model/cell.entity';
// import { CellDTO } from '../cell/dto/cell.dto';

// async function run() {
//   const opt = {
//     ...configService.getTypeOrmConfig(),
//     debug: true
//   };

//   const connection = await createConnection(opt as ConnectionOptions);
//   const cellService = new CellService(connection.getRepository(Cell), new HttpService());

//   const work = _.range(1, 10)
//     .map(n => CellDTO.from({
//       id: n,
//       capacity: 100 * n,
//       txHash: `0x0${n}`,
//       address: `0x0${n}`,
//       index: `0x0${n}`,
//       isLive: true
//     }))
//     .map(dto => cellService.create(dto)
//       .then(r => (console.log('done ->', r.capacity), r)))

//   return await Promise.all(work);
// }

// run()
//   .then(_ => console.log('...wait for script to exit'))
//   .catch(error => console.error('seed error', error));
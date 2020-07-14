import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AddressModule } from '../address.module';
import { AddressService } from '../address.service';
import { CkbService } from '../../ckb/ckb.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Address } from '../../model/address.entity';
import { AddressRepository } from '../address.repository';

/**
 *
 * https://github.com/Regnised/MockTypeorm/blob/master/test/app.e2e-spec.ts
 * **/
describe('Address Controller (e2e)', () => {
  let app: INestApplication;
  //   let addressService: AddressService;
  //   let httpService: HttpService;

  class AddressServiceMock {
    async getAddressInfo(lockHash) {
      console.log('mock getAddressInfo');
      return { capacity: '9000' };
    }
  }

  const addressService = {
    getAddressInfo: lockHash => {
      console.log('mock getAddressInfo 222');
      return "{'capacity': '90000'}";
    },
  };

  beforeEach(async () => {
    const AddressServiceProvider = {
      provide: AddressService,
      useClass: AddressServiceMock,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AddressModule],
      providers: [AddressService],
    })
      .overrideProvider(getRepositoryToken(AddressRepository))
      .useFactory({
        factory: () => ({
          create: jest.fn(() => new Promise(resolve => resolve('project'))),
          find: jest.fn(() => new Promise(resolve => resolve('project'))),
          findOne: jest.fn(),
          delete: jest.fn(),
          save: jest.fn(),
        }),
      })
      .overrideProvider(AddressService)
      .useValue(addressService)
      .compile();

    app = moduleFixture.createNestApplication();

    // addressService = await moduleFixture.get<AddressService>(AddressService);
    await app.init();
  });

  it('GET address info', async () => {
    const lockHash = '0xeeeeeeeeeeeeeee';
    const expectedResult = "{'capacity': '90000'}";

    const response = await request(app.getHttpServer())
      .get(`/address/${lockHash}`)
      .expect(200);
    expect(response.text).toEqual(expectedResult);
  });

  afterAll(async () => {
    await app.close();
  });
});

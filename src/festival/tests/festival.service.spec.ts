import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Festival } from '../entities/festival.entity';
import { FestivalService } from '../festival.service';

describe('FestivalService', () => {
  let service: FestivalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FestivalService,
        {
          provide: getRepositoryToken(Festival),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FestivalService>(FestivalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

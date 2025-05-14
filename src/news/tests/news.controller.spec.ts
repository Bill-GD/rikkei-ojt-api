import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsQuery } from '../dto/news-query.dto';
import { News } from '../entities/news.entity';
import { NewsController } from '../news.controller';
import { NewsService } from '../news.service';

describe('NewsController', () => {
  let controller: NewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(News),
          useValue: {
            find: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all news', () => {
    expect(controller.findAll({} as NewsQuery)).toBeInstanceOf(Array);
  });
});

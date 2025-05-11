import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFestivalDto } from '../dto/create-festival.dto';
import { UpdateFestivalDto } from '../dto/update-festival.dto';
import { Festival } from '../entities/festival.entity';
import { FestivalController } from '../festival.controller';
import { FestivalService } from '../festival.service';

describe('FestivalController', () => {
  let controller: FestivalController, service: FestivalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalController],
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

    controller = module.get<FestivalController>(FestivalController);
    service = module.get(FestivalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create on create', async () => {
    const dto = { title: 'Mock Festival' } as CreateFestivalDto,
      file = { filename: `${Date.now()}_mockfile.png` } as Express.Multer.File;
    jest.spyOn(service, 'create');

    await controller.create(dto, file);
    expect(service.create).toHaveBeenCalledWith({
      ...dto,
      image: `uploads/${file.filename}`,
    });
  });

  it('should call service.findAll on findAll', async () => {
    jest.spyOn(service, 'findAll');
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne on findOne', async () => {
    jest.spyOn(service, 'findOne');
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service.update on update', async () => {
    const dto = { title: 'Mock Festival' } as UpdateFestivalDto;
    jest.spyOn(service, 'update');

    await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.remove on remove', async () => {
    jest.spyOn(service, 'remove');
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});

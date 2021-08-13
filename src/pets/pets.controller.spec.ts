import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Pet } from './pet.entity';
import { PetsController } from './pets.controller';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<Record<string, unknown>>;
};

export const repositoryMockFactory: () => MockType<MongoRepository<any>> =
  jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  }));

describe('PetsController', () => {
  let controller: PetsController;
  let petsRepository: MockType<MongoRepository<Pet>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Pet),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [PetsController],
    }).compile();

    controller = module.get<PetsController>(PetsController);
    petsRepository = module.get(getRepositoryToken(Pet));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find a pet', async () => {
    const pet = { id: 123123, name: 'pet', animalType: 'type' };
    petsRepository.findOne.mockReturnValue(pet);

    expect(await controller.getPet(pet.id)).toEqual(pet);

    expect(petsRepository.findOne).toHaveBeenCalledWith(pet.id);
  });
});

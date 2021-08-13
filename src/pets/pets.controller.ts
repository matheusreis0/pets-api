import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Pet } from './pet.entity';

@Controller('pets')
export class PetsController {
  constructor(
    @InjectRepository(Pet)
    private readonly petsRepository: MongoRepository<Pet>,
  ) {}

  @Get()
  async getPets(): Promise<{
    count: number;
    next: string;
    previous: string;
    results: Pet[];
  }> {
    const pets = await this.petsRepository.find();
    return { count: pets.length, next: '', previous: '', results: pets };
  }

  @Get(':id')
  async getPet(@Param('id') id): Promise<Pet> {
    const pet = ObjectID.isValid(id) && (await this.petsRepository.findOne(id));

    if (!pet) {
      // Entity not found
      throw new NotFoundException();
    }
    return pet;
  }

  @Post()
  async createPet(@Body() pet: Partial<Pet>): Promise<Pet> {
    if (!pet || !pet.name || !pet.animalType) {
      throw new BadRequestException(
        `A pet must have ate least name and animalType defined`,
      );
    }
    return await this.petsRepository.save(new Pet(pet));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePet(@Param('id') id, @Body() pet: Partial<Pet>): Promise<void> {
    if (!pet || !pet.name || !pet.animalType) {
      throw new BadRequestException(
        `A pet must have ate least name and animalType defined`,
      );
    }

    // Check if entity exists
    const exists =
      ObjectID.isValid(id) && (await this.petsRepository.findOne(id));

    if (!exists) {
      throw new NotFoundException();
    }
    await this.petsRepository.update(id, pet);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePet(@Param('id') id): Promise<void> {
    // Check if entity exists
    const exists =
      ObjectID.isValid(id) && (await this.petsRepository.findOne(id));
    if (!exists) {
      throw new NotFoundException();
    }
    await this.petsRepository.delete(id);
  }
}

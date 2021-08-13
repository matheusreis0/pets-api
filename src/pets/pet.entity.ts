import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('pets')
export class Pet {
  @ObjectIdColumn() id: ObjectID;
  @Column() name: string;
  @Column() animalType: string;
  @Column() pictureUrl?: string;
  @Column() birthDate?: Date;
  @Column() data: Record<string, unknown>;

  constructor(pet?: Partial<Pet>) {
    Object.assign(this, pet);
  }
}

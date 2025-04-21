import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}
  create(createTypeDto: CreateTypeDto) {
    return this.typeRepository.save(createTypeDto);
  }
  findAll() {
    return this.typeRepository.find();
  }

  findOne(id: number) {
    return this.typeRepository.findOneBy({ id });
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return this.typeRepository.update(id, updateTypeDto);
  }

  async remove(id: number): Promise<void> {
    const type = await this.typeRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException(`Type with ID ${id} not found`);
    }
    await this.typeRepository.softRemove(type);
  }
}

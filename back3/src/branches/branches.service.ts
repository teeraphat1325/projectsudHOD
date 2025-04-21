import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly typeRepository: Repository<Branch>,
  ) {}
  create(createBranchDto: CreateBranchDto) {
    return this.typeRepository.save(createBranchDto);
  }

  findAll() {
    return this.typeRepository.find();
  }

  findOne(id: number) {
    return this.typeRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return this.typeRepository.update(id, updateBranchDto);
  }

  remove(id: number) {
    return this.typeRepository.softDelete(id);
  }
}

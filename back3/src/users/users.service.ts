import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { In } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // ดึงข้อมูล roles
    const roles = await this.rolesRepository.find({
      where: {
        id: In(createUserDto.roles.map((role) => role.id)),
      },
    });

    // สร้าง user object
    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      gender: createUserDto.gender,
      roles: roles,
      branchesID: createUserDto.branchesID,
    });

    return await this.usersRepository.save(newUser);
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: ['roles', 'branch'],
    });
  }

  async findOneByLogin(email: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { email },
      select: ['id', 'email', 'password'],
      relations: ['roles', 'branch'],
    });

    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'branch'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Find the user with roles relation
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'branch'],
    });

    // If user doesn't exist, throw NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Handle roles separately: map the role IDs to role entities
    if (updateUserDto.roles) {
      const roles = await this.rolesRepository.find({
        where: {
          id: In(updateUserDto.roles.map((role) => role.id)),
        },
      });

      // Update the user roles with the fetched roles
      user.roles = roles;
    }

    // อัปเดต branchesID โดยตรง
    if (updateUserDto.branchesID !== undefined) {
      user.branchesID = updateUserDto.branchesID;
    }

    // Merge the rest of the updated properties
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roles: _r, branchesID: _b, ...restProperties } = updateUserDto;
    Object.assign(user, restProperties);

    // Save the updated user
    await this.usersRepository.save(user);

    return user;
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}

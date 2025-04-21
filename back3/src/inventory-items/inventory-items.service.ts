import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InventoryItemsService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  create(createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryItemRepository.save(createInventoryItemDto);
  }

  findAll(branchId?: number) {
    if (branchId) {
      return this.inventoryItemRepository.find({
        where: { branch: { id: branchId } },
        relations: ['category', 'branch'],
      });
    }
    return this.inventoryItemRepository.find({
      relations: ['category', 'branch'],
    });
  }

  findOne(id: number) {
    return this.inventoryItemRepository.findOne({
      where: { id },
      relations: ['category', 'branch'],
    });
  }

  async update(id: number, updateInventoryItemDto: UpdateInventoryItemDto) {
    const inventoryItem = await this.inventoryItemRepository.findOne({
      where: { id },
      relations: ['category', 'branch'],
    });
    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }
    Object.assign(inventoryItem, updateInventoryItemDto);
    return this.inventoryItemRepository.save(inventoryItem);
  }

  remove(id: number) {
    return this.inventoryItemRepository.delete(id);
  }

  async findLowStockItemsByBranchId(branchId: number) {
    // ใช้ Raw SQL subquery เพื่อเปรียบเทียบ quantity กับ minStock
    return this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.branch', 'branch')
      .where('branch.id = :branchId', { branchId })
      .andWhere('item.quantity <= item.minStock')
      .getMany();
  }
}

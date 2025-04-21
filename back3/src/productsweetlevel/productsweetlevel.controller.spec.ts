import { Test, TestingModule } from '@nestjs/testing';
import { ProductsweetlevelController } from './productsweetlevel.controller';
import { ProductsweetlevelService } from './productsweetlevel.service';

describe('ProductsweetlevelController', () => {
  let controller: ProductsweetlevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsweetlevelController],
      providers: [ProductsweetlevelService],
    }).compile();

    controller = module.get<ProductsweetlevelController>(
      ProductsweetlevelController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

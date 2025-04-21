import { Test, TestingModule } from '@nestjs/testing';
import { ProductsizeController } from './productsize.controller';
import { ProductsizeService } from './productsize.service';

describe('ProductsizeController', () => {
  let controller: ProductsizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsizeController],
      providers: [ProductsizeService],
    }).compile();

    controller = module.get<ProductsizeController>(ProductsizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

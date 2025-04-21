import { Test, TestingModule } from '@nestjs/testing';
import { ProductsweetlevelService } from './productsweetlevel.service';

describe('ProductsweetlevelService', () => {
  let service: ProductsweetlevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsweetlevelService],
    }).compile();

    service = module.get<ProductsweetlevelService>(ProductsweetlevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsizeService } from './productsize.service';

describe('ProductsizeService', () => {
  let service: ProductsizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsizeService],
    }).compile();

    service = module.get<ProductsizeService>(ProductsizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

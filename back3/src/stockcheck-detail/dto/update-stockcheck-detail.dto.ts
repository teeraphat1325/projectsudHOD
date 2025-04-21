import { PartialType } from '@nestjs/swagger';
import { StockcheckItemDto } from './stockcheck-item.dto';

export class UpdateStockcheckDetailDto extends PartialType(StockcheckItemDto) {}

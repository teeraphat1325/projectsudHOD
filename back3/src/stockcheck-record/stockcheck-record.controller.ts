import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StockcheckRecordService } from './stockcheck-record.service';
import { CreateStockcheckRecordDto } from './dto/create-stockcheck-record.dto';
import { UpdateStockcheckRecordDto } from './dto/update-stockcheck-record.dto';

@Controller('stockcheck-record')
export class StockcheckRecordController {
  constructor(
    private readonly stockcheckRecordService: StockcheckRecordService,
  ) {}

  @Post()
  create(@Body() createStockcheckRecordDto: CreateStockcheckRecordDto) {
    return this.stockcheckRecordService.create(createStockcheckRecordDto);
  }

  @Get()
  findAll(@Query('branchId') branchId?: string) {
    return this.stockcheckRecordService.findAll(
      branchId ? +branchId : undefined,
    );
  }

  @Get('all')
  findAllWithoutFilter() {
    return this.stockcheckRecordService.findAllWithoutFilter();
  }

  @Get('branch/:branchId')
  findByBranch(@Param('branchId') branchId: string) {
    return this.stockcheckRecordService.findByBranchId(+branchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockcheckRecordService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockcheckRecordDto: UpdateStockcheckRecordDto,
  ) {
    return this.stockcheckRecordService.update(+id, updateStockcheckRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockcheckRecordService.remove(+id);
  }
}

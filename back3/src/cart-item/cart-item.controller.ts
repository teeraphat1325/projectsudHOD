import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CartItem } from './entities/cart-item.entity';
import { CartItemDto } from './dto/cart-item.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
  }

  @Post('single')
  @ApiOperation({ summary: 'Add a single item to cart' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully added to cart',
    type: CartItem,
  })
  createSingle(@Body() cartItemDto: CartItemDto) {
    return this.cartItemService.createSingle(cartItemDto);
  }

  @Get()
  findAll() {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(+id);
  }
}

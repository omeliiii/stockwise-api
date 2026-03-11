import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get('low-stock')
    findLowStock(): Promise<Product[]> {
        return this.productsService.findLowStock();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.productsService.remove(id);
    }
}

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const mockProduct: Product = {
    id: 1,
    name: 'Widget',
    quantity: 5,
    minThreshold: 10,
};

const mockProductsList: Product[] = [
    mockProduct,
    { id: 2, name: 'Gadget', quantity: 50, minThreshold: 10 },
];

const mockService = () => ({
    findAll: jest.fn().mockResolvedValue(mockProductsList),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    findLowStock: jest.fn().mockResolvedValue([mockProduct]),
    create: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue({ ...mockProduct, quantity: 20 }),
    remove: jest.fn().mockResolvedValue(undefined),
});

describe('ProductsController', () => {
    let controller: ProductsController;
    let service: jest.Mocked<ProductsService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                {
                    provide: ProductsService,
                    useFactory: mockService,
                },
            ],
        }).compile();

        controller = module.get<ProductsController>(ProductsController);
        service = module.get(ProductsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const result = await controller.findAll();

            expect(result).toEqual(mockProductsList);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findLowStock', () => {
        it('should return low-stock products', async () => {
            const result = await controller.findLowStock();

            expect(result).toEqual([mockProduct]);
            expect(service.findLowStock).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('should return a single product', async () => {
            const result = await controller.findOne(1);

            expect(result).toEqual(mockProduct);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });

        it('should propagate NotFoundException from service', async () => {
            service.findOne.mockRejectedValueOnce(
                new NotFoundException('Product with ID 999 not found'),
            );

            await expect(controller.findOne(999)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('should create and return a product', async () => {
            const dto: CreateProductDto = {
                name: 'Widget',
                quantity: 5,
                minThreshold: 10,
            };

            const result = await controller.create(dto);

            expect(result).toEqual(mockProduct);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('update', () => {
        it('should update and return the product', async () => {
            const dto: UpdateProductDto = { quantity: 20 };

            const result = await controller.update(1, dto);

            expect(result).toEqual({ ...mockProduct, quantity: 20 });
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });

        it('should propagate NotFoundException from service', async () => {
            service.update.mockRejectedValueOnce(
                new NotFoundException('Product with ID 999 not found'),
            );

            await expect(
                controller.update(999, { quantity: 20 }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove the product', async () => {
            await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
        });

        it('should propagate NotFoundException from service', async () => {
            service.remove.mockRejectedValueOnce(
                new NotFoundException('Product with ID 999 not found'),
            );

            await expect(controller.remove(999)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
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

const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockProduct]),
};

const mockRepository = () => ({
    find: jest.fn().mockResolvedValue(mockProductsList),
    findOneBy: jest.fn().mockResolvedValue(mockProduct),
    create: jest.fn().mockReturnValue(mockProduct),
    save: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(undefined),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
});

describe('ProductsService', () => {
    let service: ProductsService;
    let repository: jest.Mocked<Repository<Product>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repository = module.get(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const result = await service.findAll();

            expect(result).toEqual(mockProductsList);
            expect(repository.find).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('should return a single product by id', async () => {
            const result = await service.findOne(1);

            expect(result).toEqual(mockProduct);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw NotFoundException when product not found', async () => {
            repository.findOneBy.mockResolvedValueOnce(null);

            await expect(service.findOne(999)).rejects.toThrow(
                new NotFoundException('Product with ID 999 not found'),
            );
        });
    });

    describe('findLowStock', () => {
        it('should return products where quantity < minThreshold', async () => {
            const result = await service.findLowStock();

            expect(result).toEqual([mockProduct]);
            expect(repository.createQueryBuilder).toHaveBeenCalledWith(
                'product',
            );
            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                'product.quantity < product.minThreshold',
            );
            expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        it('should create and return a new product', async () => {
            const dto: CreateProductDto = {
                name: 'Widget',
                quantity: 5,
                minThreshold: 10,
            };

            const result = await service.create(dto);

            expect(result).toEqual(mockProduct);
            expect(repository.create).toHaveBeenCalledWith(dto);
            expect(repository.save).toHaveBeenCalledWith(mockProduct);
        });
    });

    describe('update', () => {
        it('should update and return the product', async () => {
            const dto: UpdateProductDto = { quantity: 20 };
            const updatedProduct = { ...mockProduct, quantity: 20 };
            repository.save.mockResolvedValueOnce(updatedProduct);

            const result = await service.update(1, dto);

            expect(result).toEqual(updatedProduct);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException when updating non-existent product', async () => {
            repository.findOneBy.mockResolvedValueOnce(null);
            const dto: UpdateProductDto = { quantity: 20 };

            await expect(service.update(999, dto)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('remove', () => {
        it('should remove the product', async () => {
            await service.remove(1);

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repository.remove).toHaveBeenCalledWith(mockProduct);
        });

        it('should throw NotFoundException when removing non-existent product', async () => {
            repository.findOneBy.mockResolvedValueOnce(null);

            await expect(service.remove(999)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});

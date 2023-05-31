import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from './product.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: ProductRepository,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();
    if (!products.length) {
      throw new NotFoundException({ message: 'Product not found' });
    }
    return products;
  }

  async findById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException({ message: 'Product not found' });
    }
    return product;
  }

  async findByName(name: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ where: { name } });
    return product;
  }

  async create(dto: ProductDto): Promise<any> {
    const exists = await this.findByName(dto.name);
    if (exists)
      throw new BadRequestException({ message: 'Product already exists ' });

    const dtoToEntity = new ProductEntity();
    dtoToEntity.name = dto.name;
    dtoToEntity.price = dto.price;
    const product = this.productRepository.create(dtoToEntity);
    await this.productRepository.save(product);
    return new MessageDto('product created successfully');
  }

  async update(id: number, dto: ProductDto): Promise<any> {
    const product = await this.findById(id);
    dto.name ? (product.name = dto.name) : (product.name = product.name);
    dto.price ? (product.price = dto.price) : (product.price = product.price);
    await this.productRepository.save(product);
    return { message: 'product successfully updated' };
  }

  async delete(id: number): Promise<any> {
    const product = await this.findById(id);
    await this.productRepository.delete(product);
    return { message: 'product successfully deleted' };
  }
}

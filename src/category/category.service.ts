import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesResponse } from 'src/category/types/categories.type';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll(
    page: number,
    limit: number,
    orderBy: string = 'id',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CategoriesResponse> {
    const [results, totalItems] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [orderBy]: orderDirection,
      },
    });

    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: results,
      pagination: {
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        total_items: totalItems,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}

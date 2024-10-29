import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesResponse } from 'src/category/types/categories.type';
import { Category } from 'src/category/entities/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ category: Category; message: string }> {
    const cateNew = this.categoryRepository.create(createCategoryDto);
    const categories = await this.categoryRepository.save(cateNew);
    return {
      message: 'create categoris success',
      category: categories,
    };
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

  async findOne(id: number): Promise<Category> {
    const categories = await this.categoryRepository.findOneBy({ id });
    if (!categories) {
      throw new NotFoundException(`Category với ID ${id} không tồn tại`);
    }
    return categories;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ category: Category; message: string }> {
    await this.categoryRepository.update(id, updateCategoryDto);

    const updatedCategory = await this.findOne(id);
    return {
      message: 'update category success',
      category: updatedCategory,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.categoryRepository.delete(id);
    return { message: `delete success category id:${id}` };
  }
}

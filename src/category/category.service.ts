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
  ): Promise<{ newCategory: Category; message: string }> {
    const newCategoryData = this.categoryRepository.create(createCategoryDto);
    const newCategory = await this.categoryRepository.save(newCategoryData);
    return {
      message: 'Category created successfully.',
      newCategory: newCategory,
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
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category is not found with id =${id}`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ updatedCategory: any; message: string }> {
    await this.findOne(id);
    await this.categoryRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.findOne(id);
    return {
      message: 'Category updated successfully.',
      updatedCategory: updatedCategory,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.categoryRepository.delete(id);
    return { message: `Delete success category id:${id}` };
  }
}

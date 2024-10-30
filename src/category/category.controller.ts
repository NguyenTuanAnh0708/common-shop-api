import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { GetCategoriesDto } from 'src/category/dto/get-categories.dto';
import { CategoriesResponse } from 'src/category/types/categories.type';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';

@ApiTags('Category')
@Controller('category')
@UseGuards(AuthGuard)
@ApiBearerAuth('authorization')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories with pagination',
    description: `
      Retrieves a paginated list of categories from the shop.
      You can specify the number of categories per page and which page to fetch.
      Optionally, you can sort the categories by a specific field in either ascending or descending order.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully.',
    type: [Category],
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'The number of categories to display per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'The current page number',
    example: 1,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'The column name to sort by, e.g.',
  })
  @ApiQuery({
    name: 'orderDirection',
    required: false,
    description:
      'The direction of sorting, can be ASC (ascending) or DESC (descending)',
  })
  async getCategories(
    @Query() query: GetCategoriesDto,
  ): Promise<CategoriesResponse> {
    console.log(query);
    return await this.categoryService.findAll(
      query.page,
      query.limit,
      query.orderBy,
      query.orderDirection,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}

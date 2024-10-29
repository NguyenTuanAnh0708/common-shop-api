import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'nvarchar', nullable: true })
  description: string;

  @Column({ type: 'nvarchar' })
  slug: string;

  @Column({ type: 'int', nullable: true })
  parent_category_id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}

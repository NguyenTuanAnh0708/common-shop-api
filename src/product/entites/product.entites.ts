import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {} from 'class-validator';
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar' })
  name: string;

  @Column({ type: 'nvarchar' })
  description: string;

  @Column({ type: 'nvarchar' })
  slug: string;

  @Column()
  weight: string;

  @Column()
  price: number;

  @Column()
  stock_quantity: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMETAMP',
  })
  update_at: Date;
}

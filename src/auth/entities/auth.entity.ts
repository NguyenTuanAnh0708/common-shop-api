import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  firstName: string;

  @Column({ type: 'nvarchar', length: 255 })
  lastName: string;

  @Column({ type: 'nvarchar', length: 20, unique: true })
  userName: string;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'nvarchar', length: 255 })
  password: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    default: 'user',
  })
  role: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

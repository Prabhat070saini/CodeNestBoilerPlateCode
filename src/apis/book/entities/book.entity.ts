import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { ulid } from 'ulid';
import { ESchema } from '../../../common/constants/app.enum';
@Entity({ name: 'books', schema: ESchema.DBO_SCHEMA })
@Index(['author'], { unique: true })
@Index(['book_id'], { unique: true })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 26, unique: true })
  book_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  discription?: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  author: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  year_of_publish?: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
  @Column({ type: 'int', nullable: true })
  updated_by: number;
  @BeforeInsert()
  generateUlid(): string {
    this.book_id = ulid();
    return this.book_id;
  }
}

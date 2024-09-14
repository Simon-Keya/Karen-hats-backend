import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders, { eager: true }) // Eager loading the user
  user: User;

  @Column('int', { array: true }) // Assuming productIds is an array of product IDs
  productIds: number[]; // Changed to number[] to better represent multiple product IDs

  @Column('decimal', { precision: 10, scale: 2 }) // Precise decimal for monetary values
  totalAmount: number;

  @Column({ default: 'Pending' }) // Default status
  status: string;

  @Column({ nullable: true }) // Tracking number can be nullable initially
  trackingNumber: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Optional: If you want to store updated timestamps
  @Column({ nullable: true })
  updatedAt: Date; // Add an updatedAt field for tracking changes
}

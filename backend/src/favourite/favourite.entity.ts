import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  propertyId: string; // Assuming propertyId is string, like address or ID

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
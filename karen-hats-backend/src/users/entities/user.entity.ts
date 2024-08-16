import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['username', 'email']) // Ensure unique usernames and emails
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Ensure username is unique
  username: string;

  @Column({ unique: true }) // Ensure email is unique
  email: string;

  @Column()
  password: string;
}

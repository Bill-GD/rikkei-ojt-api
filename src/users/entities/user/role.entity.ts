import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['ROLE_ADMIN', 'ROLE_USER'] })
  role_name: 'ROLE_ADMIN' | 'ROLE_USER';

  @OneToMany(() => UserRole, (ur) => ur.role)
  userRoles: UserRole[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRoles } from '../../common/enum/user-role.enum';
import { UserRole } from './user-role.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRoles })
  role_name: UserRoles;

  @OneToMany(() => UserRole, (ur) => ur.role)
  userRoles: UserRole[];
}

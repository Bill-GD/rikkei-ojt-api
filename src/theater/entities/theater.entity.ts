import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity('theater')
export class Theater {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    location: string;

    @Column({ type: 'varchar', length: 11 })
    phone: string;

    @ApiProperty()
    @CreateDateColumn() 
    created_at: Date;

    @ApiProperty()
    @UpdateDateColumn() 
    updated_at: Date;
}

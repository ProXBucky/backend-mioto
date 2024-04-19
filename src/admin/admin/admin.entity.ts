import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    adminId: number;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    username: string;

    @Column()
    password: string;
}

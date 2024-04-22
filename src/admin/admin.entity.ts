import { Exclude } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    adminId: number;

    @Column()
    @IsString()
    fullname: string;

    @Column()
    @IsString()
    phone: string;

    @Column()
    @IsString()
    username: string;

    @Column()
    @IsString()
    @Exclude()
    password: string;

    @Column()
    @IsEmail()
    email: string;
}

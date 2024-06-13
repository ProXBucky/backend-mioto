import { Exclude } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    adminId: number;

    @Column()
    fullname: string;

    @Column()
    phone: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    @IsEnum(['Staff', 'Admin'])
    role: string

    @Column({ nullable: true })
    avatarImage: string;

    @Column({ nullable: true })
    avatarImageID: string;

    @Column({ nullable: true })
    @IsEnum(['Nam', 'Nữ', null])
    gender: string | null;

    @Column({ nullable: true, type: 'date' })
    @IsDateString()
    dob: Date;
}

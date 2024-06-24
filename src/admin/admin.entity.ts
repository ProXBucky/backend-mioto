import { IsDateString, IsEmail, IsEnum, IsString } from "class-validator";
import { Blog } from "../blog/blog.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => Blog, blog => blog.admin)
    blogs: Blog[];
}

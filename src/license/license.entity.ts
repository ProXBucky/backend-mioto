import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class UserLicense {
    @PrimaryGeneratedColumn()
    licenseId: number;

    @Column()
    @IsNotEmpty()
    licenseNumber: string;

    @Column()
    @IsNotEmpty()
    fileUpload: string;

    @Column()
    @IsNotEmpty()
    fileUploadID: string;

    @OneToOne(() => User, user => user.licenses)
    @JoinColumn({ name: 'userId' })
    user: User;
}
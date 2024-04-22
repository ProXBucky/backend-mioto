import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { UserAddress } from "../address/address.entity";
import { UserLicense } from "../license/license.entity";
import { Like } from "../like/like.entity";
import { CarOwner } from "../owner/owner.entity";
import { Rent } from "../rent/rent.entity";
import { Report } from "../report/report.entity";
import { Review } from "../review/review.entity";
import { Voucher } from "../voucher/voucher.entity";
import { BeforeInsert, Column, Entity, IsNull, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as argon2 from "argon2"
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    fullname: string;

    @Column()
    @IsNotEmpty()
    phone: string;

    @Column({ nullable: true })
    avatarImage: string;

    @Column({ nullable: true })
    avatarImageID: string;

    @Column()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsNotEmpty()
    @Exclude()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }

    @Column({ type: 'date' })
    @IsDateString()
    joinDate: Date;

    @Column({ nullable: true })
    @IsEnum(['Nam', 'Nữ', null])
    gender: string | null;

    @Column({ nullable: true, type: 'date' })
    @IsOptional()
    @IsDateString()
    dob: Date;

    @OneToMany(() => UserAddress, userAddress => userAddress.user)
    @JoinColumn({ name: 'addressId' })
    address: UserAddress[];

    @OneToOne(() => UserLicense, userLicense => userLicense.user)
    licenses: UserLicense;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Report, report => report.user)
    reports: Report[];

    @OneToMany(() => Like, like => like.user)
    likes: Like[];

    @OneToOne(() => CarOwner, carOwner => carOwner.user)
    cars: CarOwner;

    @OneToMany(() => Rent, rent => rent.user)
    rents: Rent[];

    @OneToMany(() => Voucher, voucher => voucher.user)
    vouchers: Voucher[];
}
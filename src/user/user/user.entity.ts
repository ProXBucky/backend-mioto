import { IsDateString, IsEnum, IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserAddress } from "../address/address.entity";
import { UserLicense } from "../license/license.entity";
import { Review } from "../../review/review/review.entity";
import { Report } from "../../review/report/report.entity";
import { Like } from "../../review/like/like.entity";
import { CarOwner } from "../owner/owner.entity";
import { Rent } from "../../rent/rent/rent.entity";
import { Voucher } from "../../rent/voucher/voucher.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    @IsNotEmpty()
    fullname: string;

    @Column()
    @IsNotEmpty()
    phone: string;

    @Column({ nullable: true })
    avatarImage: string;

    @Column()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsNotEmpty()
    password: string;

    @Column({ type: 'date' })
    @IsDateString()
    joinDate: Date;

    @Column()
    @IsNotEmpty()
    @IsEnum(['male', 'female']) // Assuming 'gender' can only be male or female
    gender: string;

    @Column({ type: 'date' })
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
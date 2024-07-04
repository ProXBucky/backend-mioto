// import {IsEmail, IsEnum } from "class-validator";
// import { UserAddress } from "../address/address.entity";
// import { UserLicense } from "../license/license.entity";
// import { Like } from "../like/like.entity";
// import { Rent } from "../rent/rent.entity";
// import { Report } from "../report/report.entity";
// import { Review } from "../review/review.entity";
// import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
// import * as argon2 from "argon2"
// import { VoucherOwner } from "../voucher/voucherOwner.entity";
// import { Car } from "../car/car.entity";

// @Entity()
// export class User {
//     @PrimaryGeneratedColumn()
//     userId: number;

//     @Column()
//     @IsEmail()
//     email: string;

//     @Column()
//     fullname: string;

//     @Column()
//     phone: string;

//     @Column({ nullable: true })
//     avatarImage: string;

//     @Column({ nullable: true })
//     avatarImageID: string;

//     @Column()
//     username: string;

//     @Column()
//     password: string;

//     @BeforeInsert()
//     async hashPassword() {
//         this.password = await argon2.hash(this.password);
//     }

//     @Column({ type: 'date' })
//     joinDate: Date;

//     @Column({ nullable: true })
//     @IsEnum(['Nam', 'Nữ', null])
//     gender: string | null;

//     @Column({ nullable: true, type: 'date' })
//     dob: Date;

//     @OneToMany(() => UserAddress, userAddress => userAddress.user)
//     @JoinColumn({ name: 'addressId' })
//     address: UserAddress[];

//     @OneToOne(() => UserLicense, userLicense => userLicense.user)
//     licenses: UserLicense;

//     @OneToMany(() => Review, review => review.user)
//     reviews: Review[];

//     @OneToMany(() => Report, report => report.user)
//     reports: Report[];

//     @OneToMany(() => Like, like => like.user)
//     likes: Like[];

//     @OneToMany(() => Car, car => car.user)
//     cars: Car[];

//     @OneToMany(() => Rent, rent => rent.user)
//     rents: Rent[];

//     @OneToMany(() => VoucherOwner, voucherOwner => voucherOwner.user)
//     voucherOwners: VoucherOwner[];
// }


import { IsEmail, IsEnum } from 'class-validator';
import { UserAddress } from '../address/address.entity';
import { UserLicense } from '../license/license.entity';
import { Like } from '../like/like.entity';
import { Rent } from '../rent/rent.entity';
import { Report } from '../report/report.entity';
import { Review } from '../review/review.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import * as argon2 from 'argon2';
import { VoucherOwner } from '../voucher/voucherOwner.entity';
import { Car } from '../car/car.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    fullname: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    avatarImage: string;

    @Column({ nullable: true })
    avatarImageID: string;

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ nullable: true })
    password: string;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await argon2.hash(this.password);
        }
    }

    @Column({ type: 'date' })
    joinDate: Date;

    @Column({ nullable: true })
    @IsEnum(['Nam', 'Nữ', null])
    gender: string | null;

    @Column({ nullable: true, type: 'date' })
    dob: Date;

    @Column({ nullable: true })
    googleId: string;

    @Column({ nullable: true })
    facebookId: string;

    @OneToMany(() => UserAddress, userAddress => userAddress.user)
    address: UserAddress[];

    @OneToOne(() => UserLicense, userLicense => userLicense.user)
    licenses: UserLicense;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Report, report => report.user)
    reports: Report[];

    @OneToMany(() => Like, like => like.user)
    likes: Like[];

    @OneToMany(() => Car, car => car.user)
    cars: Car[];

    @OneToMany(() => Rent, rent => rent.user)
    rents: Rent[];

    @OneToMany(() => VoucherOwner, voucherOwner => voucherOwner.user)
    voucherOwners: VoucherOwner[];
}
import { User } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Voucher } from "./voucher.entity";


@Entity()
export class VoucherOwner {
    @PrimaryGeneratedColumn()
    voucherOwnerId: number;

    @Column()
    status: string;

    @ManyToOne(() => User, user => user.voucherOwners)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Voucher, voucher => voucher.voucherOwners)
    @JoinColumn({ name: 'voucherId' })
    voucher: Voucher;
}
import { Rent } from "../rent/rent.entity";
import { User } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VoucherOwner } from "./voucherOwner.entity";

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn()
    voucherId: number;

    @Column()
    voucherCode: string;

    @Column('text')
    description: string;

    @Column()
    type: string;

    @Column()
    discountPercent: number;

    @Column({ type: 'date' })
    expireDate: Date;

    @Column()
    status: string;

    @OneToMany(() => VoucherOwner, voucherOwner => voucherOwner.voucher)
    voucherOwners: VoucherOwner[];
}
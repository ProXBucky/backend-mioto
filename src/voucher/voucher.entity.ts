import { Rent } from "../rent/rent.entity";
import { User } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn()
    voucherId: number;

    @Column()
    voucherCode: string;

    @Column('text')
    description: string;

    @Column()
    status: string;

    @Column()
    type: string;

    @Column()
    discountPercent: number;

    @Column({ type: 'date' })
    expireDate: Date;

    // @OneToOne(() => Rent, { nullable: true }) // Mối quan hệ tùy chọn
    // @JoinColumn()
    // rent: Rent | null;

    @ManyToOne(() => User, user => user.vouchers)
    @JoinColumn({ name: 'userId' })
    user: User;
}
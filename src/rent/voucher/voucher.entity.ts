import { User } from "../../user/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn()
    voucherId: number;

    @Column('text')
    description: string;

    @Column()
    userId: number;

    @Column()
    status: string;

    @Column({ type: 'date' })
    expireDate: Date;

    @Column()
    discountPercent: number;

    @ManyToOne(() => User, user => user.vouchers)
    @JoinColumn({ name: 'userId' })
    user: User;
}
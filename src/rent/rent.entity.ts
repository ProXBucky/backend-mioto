import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsDateString } from "class-validator";
import { User } from "../user/user.entity";
import { Car } from "../car/car.entity";
import { Payment } from "../payment/payment.entity";
import { VoucherOwner } from "../voucher/voucherOwner.entity";

@Entity()
export class Rent {
    @PrimaryGeneratedColumn()
    rentId: number;

    @Column({ type: 'date' })
    @IsDateString()
    rentBeginDate: Date;

    @Column({ type: 'date' })
    @IsDateString()
    rentEndDate: Date;

    @Column()
    rentDays: number;

    @Column()
    rentStatus: string;

    @OneToOne(() => VoucherOwner, { nullable: true }) // Mối quan hệ tùy chọn
    @JoinColumn({ name: 'voucherOwnerId' })
    voucherOwner: VoucherOwner | null;

    @ManyToOne(() => User, user => user.rents)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Car, car => car.rents)
    @JoinColumn({ name: 'carId' })
    car: Car;

    @OneToOne(() => Payment, payment => payment.rent)
    payment: Payment;
}

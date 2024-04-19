import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsDateString } from "class-validator";
import { User } from "../user/user.entity";
import { Car } from "../car/car.entity";
import { Payment } from "../payment/payment.entity";


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
    rentTime: number;

    @ManyToOne(() => User, user => user.rents)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Car, car => car.rents)
    @JoinColumn({ name: 'carId' })
    car: Car;

    @OneToOne(() => Payment, payment => payment.rent)
    @JoinColumn({ name: 'payment' })
    payment: Payment
}
import { Car } from "../../car/car/car.entity";
import { User } from "../../user/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "../payment/payment.entity";
import { IsDateString } from "class-validator";

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
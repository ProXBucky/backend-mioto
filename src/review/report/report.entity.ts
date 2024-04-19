import { IsNotEmpty } from "class-validator";
import { Car } from "../../car/car/car.entity";
import { User } from "../../user/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    reportId: number;

    @Column('text')
    @IsNotEmpty()
    reason: string;

    @ManyToOne(() => User, user => user.reports)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Car, car => car.reports)
    @JoinColumn({ name: 'carId' })
    car: Car;
}
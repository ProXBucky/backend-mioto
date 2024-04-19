import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Car } from "../car/car.entity";


@Entity()
export class CarOwner {
    @PrimaryGeneratedColumn()
    ownerId: number;

    @OneToOne(() => User, user => user.cars)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToOne(() => Car, car => car.owners)
    @JoinColumn({ name: 'carId' })
    car: Car;
}
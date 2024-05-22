import { IsDateString, IsNotEmpty } from "class-validator";
import { Car } from "../car/car.entity";
import { User } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    reviewId: number;

    @Column('text')
    content: string;

    @Column('text')
    location: string;

    @Column({ type: 'float' })
    reviewScore: number;

    @Column({ type: 'date' })
    reviewDate: Date;

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Car, car => car.reviews)
    @JoinColumn({ name: 'carId' })
    car: Car;
}
import { IsDateString, IsNotEmpty } from "class-validator";
import { Car } from "../../car/car/car.entity";
import { User } from "../../user/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    reviewId: number;

    @Column('text')
    @IsNotEmpty()
    content: string;

    @Column()
    @IsNotEmpty()
    reviewScore: number;

    @Column({ type: 'date' })
    @IsDateString()
    reviewDate: Date;

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Car, car => car.reviews)
    @JoinColumn({ name: 'carId' })
    car: Car;
}
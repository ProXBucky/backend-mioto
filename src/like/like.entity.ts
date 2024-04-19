import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';



@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    likeId: number;

    @ManyToOne(() => User, user => user.likes)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Car, car => car.likes)
    @JoinColumn({ name: 'carId' })
    car: Car;
}
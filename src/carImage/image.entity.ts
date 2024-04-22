import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "../car/car.entity";

@Entity()
export class CarImage {
    @PrimaryGeneratedColumn()
    imageId: number;

    @Column()
    imageLink: string;

    @Column()
    imageLinkID: string;

    @ManyToOne(() => Car, car => car.images)
    @JoinColumn({ name: 'carId' })
    car: Car;
}
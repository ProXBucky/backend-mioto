import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "../car/car.entity";

@Entity()
export class Feature {
    @PrimaryGeneratedColumn()
    featureId: number;

    @Column()
    featureName: string;

    @Column()
    featureIcon: string;

    @ManyToOne(() => Car, car => car.features)
    @JoinColumn({ name: 'carId' })
    car: Car;
}
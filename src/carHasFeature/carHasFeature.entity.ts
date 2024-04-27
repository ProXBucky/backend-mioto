import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "../car/car.entity";
import { Feature } from "../feature/feature.entity";

@Entity()
export class CarHasFeature {
    @PrimaryGeneratedColumn()
    carFeatureId: number;

    @ManyToOne(() => Car, car => car.carFeatures)
    @JoinColumn({ name: 'carId' })
    car: Car;

    @ManyToOne(() => Feature, feature => feature.carFeatures)
    @JoinColumn({ name: 'featureId' })
    feature: Feature;
}

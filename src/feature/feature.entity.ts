import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "../car/car.entity";
import { CarCarFeature } from "../car/carCarFeature.entity";

@Entity()
export class Feature {
    @PrimaryGeneratedColumn()
    featureId: number;

    @Column()
    featureCode: string;

    @Column()
    featureName: string;

    @Column()
    featureIcon: string;

    @OneToMany(() => CarCarFeature, carCarFeature => carCarFeature.feature)
    carFeatures: CarCarFeature[];


}
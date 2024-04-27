import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "../car/car.entity";
import { CarHasFeature } from "../carHasFeature/carHasFeature.entity";

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

    @OneToMany(() => CarHasFeature, carHasFeature => carHasFeature.feature)
    carFeatures: CarHasFeature[];


}
import { IsOptional } from "class-validator";
import { CarImage } from "../carImage/image.entity";
import { Feature } from "../feature/feature.entity";
import { Like } from "../like/like.entity";
import { CarOwner } from "../owner/owner.entity";
import { Rent } from "../rent/rent.entity";
import { Report } from "../report/report.entity";
import { Review } from "../review/review.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CarCarFeature } from "./carCarFeature.entity";


@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    carId: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    modelYear: number;

    @Column()
    capacity: number;

    @Column()
    plateNumber: string;

    @Column()
    transmission: string;

    @Column()
    fuelType: string;

    @Column({ nullable: true })
    mortgage: number | null;

    @Column()
    pricePerDay: number;

    @Column('text')
    description: string;

    @OneToMany(() => Review, review => review.car)
    reviews: Review[];

    @OneToMany(() => Report, report => report.car)
    reports: Report[];

    @OneToMany(() => Like, like => like.car)
    likes: Like[];

    @OneToOne(() => CarOwner, carOwner => carOwner.car)
    owners: CarOwner;

    @OneToMany(() => CarImage, carImage => carImage.car)
    images: CarImage[];

    @OneToMany(() => CarCarFeature, carCarFeature => carCarFeature.car)
    carFeatures: CarCarFeature[];

    @OneToMany(() => Rent, rent => rent.car)
    rents: Rent[];
}
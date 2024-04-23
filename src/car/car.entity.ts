import { CarImage } from "../carImage/image.entity";
import { Feature } from "../feature/feature.entity";
import { Like } from "../like/like.entity";
import { CarOwner } from "../owner/owner.entity";
import { Rent } from "../rent/rent.entity";
import { Report } from "../report/report.entity";
import { Review } from "../review/review.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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
    color: string;

    @Column()
    capacity: number;

    @Column()
    plateNumber: string;

    @Column()
    transmission: string;

    @Column()
    fuelType: string;

    @Column()
    mortgage: number;

    @Column()
    ownerId: number;

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

    @OneToMany(() => Feature, feature => feature.car)
    features: Feature[];

    @OneToMany(() => Rent, rent => rent.car)
    rents: Rent[];
}
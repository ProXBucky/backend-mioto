import { Rent } from "../../rent/rent/rent.entity"
import { Review } from "../../review/review/review.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Feature } from "../feature/feature.entity";
import { CarImage } from "../image/image.entity";
import { CarOwner } from "../../user/owner/owner.entity";
import { Like } from "../../review/like/like.entity";
import { Report } from "../../review/report/report.entity";

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
    fuelConsume: number;

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
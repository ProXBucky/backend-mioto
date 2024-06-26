import { CarImage } from "../carImage/image.entity";
import { Like } from "../like/like.entity";
import { Rent } from "../rent/rent.entity";
import { Report } from "../report/report.entity";
import { Review } from "../review/review.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CarHasFeature } from "../carHasFeature/carHasFeature.entity";
import { User } from "../user/user.entity";


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

    @Column({ default: 0 })
    mortgage: number;

    @Column()
    pricePerDay: number;

    @Column('text')
    description: string;

    @Column()
    streetAddress: string;

    @Column({ nullable: true })
    ward: string | null;

    @Column()
    district: string;

    @Column()
    city: string;

    @Column()
    location: string;

    @Column()
    status: string;

    @OneToMany(() => Review, review => review.car)
    reviews: Review[];

    @OneToMany(() => Report, report => report.car)
    reports: Report[];

    @OneToMany(() => Like, like => like.car)
    likes: Like[];

    @ManyToOne(() => User, user => user.cars)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => CarImage, carImage => carImage.car)
    images: CarImage[];

    @OneToMany(() => CarHasFeature, carHasFeature => carHasFeature.car)
    carFeatures: CarHasFeature[];

    @OneToMany(() => Rent, rent => rent.car)
    rents: Rent[];
}
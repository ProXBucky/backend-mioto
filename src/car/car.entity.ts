import { IsEnum, IsOptional } from "class-validator";
import { CarImage } from "../carImage/image.entity";
import { Feature } from "../feature/feature.entity";
import { Like } from "../like/like.entity";
import { CarOwner } from "../owner/owner.entity";
import { Rent } from "../rent/rent.entity";
import { Report } from "../report/report.entity";
import { Review } from "../review/review.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CarHasFeature } from "../carHasFeature/carHasFeature.entity";


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

    @Column()
    streetAddress: string;

    @Column({ nullable: true })
    ward: string | null;

    @Column()
    district: string;

    @Column()
    city: string;

    @Column({ nullable: true })
    @IsEnum(['Đang duyệt', 'Chưa cho thuê', 'Đã cho thuê'])
    status: string | null;

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

    @OneToMany(() => CarHasFeature, carHasFeature => carHasFeature.car)
    carFeatures: CarHasFeature[];

    @OneToMany(() => Rent, rent => rent.car)
    rents: Rent[];
}
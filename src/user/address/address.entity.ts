import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../user/user.entity';


@Entity()
export class UserAddress {
    @PrimaryGeneratedColumn()
    addressId: number;

    @Column()
    @IsNotEmpty()
    streetAddress: string;

    @Column()
    ward: string;

    @Column()
    district: string;

    @Column()
    @IsNotEmpty()
    city: string;

    @ManyToOne(() => User, user => user.address)
    @JoinColumn({ name: 'addressId' })
    user: User;
}
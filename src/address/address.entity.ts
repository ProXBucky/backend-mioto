import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../user/user.entity';


@Entity()
export class UserAddress {
    @PrimaryGeneratedColumn()
    addressId: number;

    @Column()
    streetAddress: string;

    @Column({ nullable: true })
    ward: string | null;

    @Column()
    district: string;

    @Column()
    city: string;

    @ManyToOne(() => User, user => user.address)
    @JoinColumn({ name: 'userId' })
    user: User;
}
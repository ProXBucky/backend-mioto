import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rent } from "../rent/rent.entity";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    paymentId: number;

    @Column()
    paymentAmount: number;

    @Column({ type: 'date' })
    paymentDate: Date;

    @Column()
    paymentStatus: string;

    @OneToOne(() => Rent, rent => rent.payment)
    // @JoinColumn({ name: 'rentId' })
    rent: Rent;
}
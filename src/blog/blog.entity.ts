import { Admin } from '../admin/admin.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    blogId: number;

    @Column()
    imageTitle: string;

    @Column()
    imageTitleId: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ default: true })
    isPublished: boolean;

    @Column({ type: 'date' })
    publishDate: Date;

    @ManyToOne(() => Admin, admin => admin.blogs)
    admin: Admin;

}
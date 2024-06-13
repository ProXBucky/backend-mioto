// create-user.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class GetAdminDTO {

    @Expose()
    adminId: string;

    @Expose()
    fullname: string;

    @Expose()
    username: string;

    @Exclude()
    password: string;

    @Expose()
    role: string;
}

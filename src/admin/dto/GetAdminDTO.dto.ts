// create-user.dto.ts
import { Expose } from 'class-transformer';

export class GetAdminDTO {

    @Expose()
    adminId: string;

    @Expose()
    fullname: string;

    @Expose()
    username: string;

    @Expose()
    password: string;

    @Expose()
    role: string;
}

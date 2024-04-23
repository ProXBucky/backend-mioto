// create-user.dto.ts
import { Expose } from 'class-transformer';

export class GetUserDTO {

    @Expose()
    userId: string;

    @Expose()
    fullname: string;

    @Expose()
    username: string;

    @Expose()
    password: string;

    @Expose()
    avatarImage: string;
}

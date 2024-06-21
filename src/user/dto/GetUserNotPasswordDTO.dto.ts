// create-user.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class GetUserNotPasswordDTO {

    @Expose()
    userId: string;

    @Expose()
    fullname: string;

    @Expose()
    username: string;

    @Exclude()
    password: string;

    @Expose()
    avatarImage: string;
}

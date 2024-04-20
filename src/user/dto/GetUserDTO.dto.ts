// create-user.dto.ts
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserDTO {

    @Expose()
    email: string;

    @Expose()
    fullname: string;

    @Expose()
    phone: string;

    @Expose()
    username: string;

    @Exclude()
    password: string;
}

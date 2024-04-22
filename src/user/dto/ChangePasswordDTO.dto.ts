// create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class ChangePasswordDTO {

    @IsNotEmpty()
    @IsEmail()
    password: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;

}

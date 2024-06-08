// create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional, IsDate, isDateString } from 'class-validator';

export class CreateAdminDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}

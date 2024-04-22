// create-user.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLicenseDTO {

    @IsNotEmpty()
    @IsString()
    licenseNumber: string;

    @IsNotEmpty()
    @IsString()
    fileUpload: string;

}

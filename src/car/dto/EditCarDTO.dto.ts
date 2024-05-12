// create-user.dto.ts
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditCarDTO {

    @IsNotEmpty()
    plateNumber: string;

    @IsOptional()
    mortgage: number | null;

    @IsNotEmpty()
    pricePerDay: number;

    @IsNotEmpty()
    streetAddress: string;

    @IsOptional()
    ward: string | null;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    arrayImageCar: string[];

}

// create-user.dto.ts
import { IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterNewCarDTO {

    @IsNotEmpty()
    brand: string;

    @IsNotEmpty()
    model: string;

    @IsNotEmpty()
    modelYear: number;

    @IsNotEmpty()
    capacity: number;

    @IsNotEmpty()
    plateNumber: string;

    @IsNotEmpty()
    transmission: string;

    @IsNotEmpty()
    fuelType: string;

    @IsOptional()
    mortgage: number | null;

    @IsNotEmpty()
    pricePerDay: number;

    @IsNotEmpty()
    description: string;

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
    arrayFeatureCode: string[];

    @IsNotEmpty()
    arrayImageCar: string[];

}

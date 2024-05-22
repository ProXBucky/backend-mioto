import { GetUserDTO } from "src/user/dto/GetUserDTO.dto";
import { CarImage } from "../../carImage/image.entity";
import { Feature } from "../../feature/feature.entity";

export class GetCarDTO {

    brand: string;

    model: string;

    modelYear: number;

    capacity: number;

    plateNumber: string;

    transmission: string;

    fuelType: string;

    mortgage: number | null;

    pricePerDay: number;

    description: string;

    streetAddress: string;

    ward: string | null;

    district: string;

    city: string;

    location: string;

    carFeatures: Feature[];

    images: CarImage[];

    owners: GetUserDTO;

}

import { IsNotEmpty, IsNumber } from "class-validator";
import { Car } from "../../car/car.entity";
import { GetUserDTO } from "../../user/dto/GetUserDTO.dto";

export class GetLikeDTO {

    likeId: number;
    carId: Car;
    userId: GetUserDTO;

}

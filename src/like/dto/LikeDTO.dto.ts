import { IsNotEmpty, IsNumber } from "class-validator";

export class LikeDTO {

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    carId: number;

}

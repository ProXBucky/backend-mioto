import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class ReportCarDTO {

    @IsNotEmpty()
    reason: string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    carId: number;

}

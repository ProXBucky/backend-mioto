import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class ReviewCarDTO {

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    reviewScore: number;

    @IsDateString()
    @IsNotEmpty()
    reviewDate: Date;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    carId: number;

}

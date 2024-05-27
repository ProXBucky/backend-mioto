import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateNewRentDTO {
    @IsNotEmpty()
    @IsDateString()
    rentBeginDate: Date;

    @IsNotEmpty()
    @IsDateString()
    rentEndDate: Date;

    @IsNotEmpty()
    @IsNumber()
    rentDays: number;

    @IsOptional()
    voucherId: number | null;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    carId: number;

    @IsNotEmpty()
    @IsNumber()
    paymentAmount: number;

    @IsNotEmpty()
    @IsNumber()
    voucherAmount: number;

}
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateNewPaymentDTO {
    @IsNotEmpty()
    @IsNumber()
    paymentAmount: number;

    @IsNotEmpty()
    @IsNumber()
    voucherAmount: number;

    @IsNotEmpty()
    @IsNumber()
    rentId: number;

}
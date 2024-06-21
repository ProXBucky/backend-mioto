// create-user.dto.ts
import { IsNotEmpty } from 'class-validator';

export class CreateNewVoucherDTO {

    @IsNotEmpty()
    voucherCode: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    discountPercent: number;

    @IsNotEmpty()
    expireDate: Date;
}

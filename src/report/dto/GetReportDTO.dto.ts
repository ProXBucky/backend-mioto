import { Expose, Type } from "class-transformer";
import { Car } from "../../car/car.entity";
import { GetUserNotPasswordDTO } from "../../user/dto/GetUserNotPasswordDTO.dto";

export class GetReportDTO {

    @Expose()
    reportId: number;

    @Expose()
    reason: string;

    @Expose()
    reportDate: Date;

    @Expose()
    @Type(() => GetUserNotPasswordDTO)
    user: GetUserNotPasswordDTO;

    @Expose()
    @Type(() => Car)
    car: Car;

    @Expose()
    @Type(() => GetUserNotPasswordDTO)
    carOwner: GetUserNotPasswordDTO;

}

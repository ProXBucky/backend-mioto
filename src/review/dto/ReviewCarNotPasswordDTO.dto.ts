
import { GetUserDTO } from "../../user/dto/GetUserDTO.dto";

export class ReviewCarNotPasswordDTO {

    reviewId: number;

    content: string;

    location: string;

    reviewScore: number;

    reviewDate: Date;

    user: GetUserDTO

}

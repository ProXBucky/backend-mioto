// create-user.dto.ts
import { IsNotEmpty } from 'class-validator';

export class CreateBlogDTO {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    imageTitle: string;

    @IsNotEmpty()
    adminId: number;

}

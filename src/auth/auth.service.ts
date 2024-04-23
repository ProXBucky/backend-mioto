import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from "argon2"
import { GetUserDTO } from '../user/dto/GetUserDTO.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async validateUser(username: string, password: string): Promise<GetUserDTO> {
        let user = await this.userService.findOneByUsernameOrEmail(username)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        let checkPassword = await argon2.verify(user.password, password);
        if (!checkPassword) {
            throw new HttpException('Password is wrong', HttpStatus.CONFLICT)
        }
        return plainToClass(GetUserDTO, user)
    }

    async createToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload);
    }
}

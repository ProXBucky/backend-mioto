import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/LoginUserDTO.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    async login(@Body() credentials: LoginUserDTO) {
        const user = await this.authService.validateUser(credentials.username, credentials.password);
        if (!user) {
            // Trả về lỗi nếu thông tin đăng nhập không hợp lệ
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        // Xác thực thông tin đăng nhập và tạo token JWT
        const token = await this.authService.createToken({ fullname: user.fullname, userId: user.userId });
        return {
            token,
            fullname: user.fullname,
            userId: user.userId,
            avatarImage: user.avatarImage
        };
    }

    @Post('/logout')
    async logout(@Body() token: { token: string }) {
        await this.authService.invalidateToken(token.token);
        return { message: 'Logged out successfully' };
    }
}
